import { ContractQueuePayload } from '@shared/types/contract-payload.type';
import { PrismaService } from '@shared/providers/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ItemType, statusTree, TransactionStatus } from 'generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { ContractDto } from '@shared/dtos/contract.dto';
import { PinataService } from '@queue/providers/pinata.service';

@Injectable()
export class TransactionsService {
  private staticUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly pinata: PinataService,
  ) {
    this.staticUrl = this.configService.get<string>('STATIC_URL')!;
  }

  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  async handleContract({
    transactionId,
    userId,
    items,
    totalPrice,
    itemRecords,
    farmRecord,
    startDate,
    endDate,
  }: ContractQueuePayload): Promise<void> {
    const startDateObj = this.parseDate(startDate);
    const endDateObj = this.parseDate(endDate);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fvtBalance: { decrement: totalPrice } },
      });

      const detailsArr: {
        name: string;
        type: ItemType;
        description?: string;
        images: string[];
        price: number;
        quantity: number;
        details: Record<string, string | number>;
        iot: boolean;
        startDate: Date;
        endDate: Date;
      }[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemRecord = itemRecords[i];

        await this.prisma.item.update({
          where: { id: item.itemId },
          data: { stock: { decrement: item.quantity } },
        });

        const rentedTreesData = Array.from({ length: item.quantity }).map(
          () => ({
            name: itemRecord.name,
            description: itemRecord.description ?? undefined,
            images: itemRecord.images,
            details: itemRecord.details ?? {},
            schedule: ((farmRecord?.schedule as any[]) ?? []).filter(
              (v) => v !== null,
            ),
            cameraUrl: null,
            status: statusTree.GROWING,
            totalProfit: 0,
            harvest: [],
            startDate: startDateObj,
            endDate: endDateObj,
            farmId: itemRecord.farmId,
            userId,
          }),
        );

        await this.prisma.rentedTree.createMany({
          data: rentedTreesData,
        });

        detailsArr.push({
          name: itemRecord.name,
          type: itemRecord.type,
          description: itemRecord.description ?? undefined,
          images: itemRecord.images,
          price: itemRecord.price,
          details: (itemRecord.details ?? {}) as Record<string, any>,
          quantity: item.quantity,
          startDate: startDateObj,
          endDate: endDateObj,
          iot: item.iot,
        });
      }

      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          // transactionHash: tx.hash,
          // blockNumber: receipt.blockNumber,
          // fromAddress: tx.from,
          // toAddress: tx.to,
          status: TransactionStatus.SUCCESS,
          details: detailsArr,
        },
      });
    } catch (error) {
      console.error('Lỗi khi xử lý giao dịch hợp đồng:', error);

      await this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'FAILED' },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: { fvtBalance: { increment: totalPrice } },
      });

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await this.prisma.item.update({
          where: { id: item.itemId },
          data: { stock: { increment: item.quantity } },
        });
      }

      await this.prisma.rentedTree.deleteMany({
        where: {
          userId,
          startDate: startDateObj,
          endDate: endDateObj,
          farmId: farmRecord.id,
        },
      });
    }
  }

  async generateContractDocument(
    transactionId: string,
    contract: ContractDto,
  ): Promise<void> {
    const templatePath = path.join(
      process.cwd(),
      'dist',
      'modules',
      'transactions',
      'templates',
      'contract.hbs',
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    const html = template({
      ...contract,
      lessorSignature: `${this.staticUrl}/signatures/${contract.lessorSignature}`,
      lesseeSignature: `${this.staticUrl}/signatures/${contract.lesseeSignature}`,
    });

    const outputDir = path.join(process.cwd(), '..', 'static', 'contracts');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // const pdfPath = path.join(outputDir, `${transactionId}.pdf`);
    const imgPath = path.join(outputDir, `${transactionId}.png`);

    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.waitForSelector('img');
    await new Promise((res) => setTimeout(res, 1000));

    // await page.pdf({ path: pdfPath, format: 'A4' });
    await page.screenshot({ path: imgPath as `${string}.png`, fullPage: true });

    await browser.close();

    await this.pinata.uploadFile(imgPath, `${transactionId}.png`);

    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        contractDocument: {
          contractImage: `${this.staticUrl}/contracts/${transactionId}.png`,
          signatureImage: `${this.staticUrl}/signatures/${contract.lesseeSignature}`,
        },
      },
    });
  }
}
