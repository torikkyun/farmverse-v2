import { Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class PinataService {
  private pinata: PinataSDK;

  constructor(private readonly configService: ConfigService) {
    this.pinata = new PinataSDK({
      pinataJwt: this.configService.get<string>('PINATA_JWT'),
      pinataGateway: this.configService.get<string>('PINATA_GATEWAY'),
    });
  }

  async uploadFile(filePath: string, fileName: string) {
    const file = fs.createReadStream(filePath);

    const result = await this.pinata.upload.public.file(
      file as unknown as File,
      {
        metadata: {
          name: fileName,
          keyvalues: {
            project: 'farmverse',
            type: 'contract',
          },
        },
      },
    );

    return result;
  }
}
