import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '@shared/providers/prisma.service';
import { PinataService } from '@queue/providers/pinata.service';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, PinataService, PrismaService],
})
export class TransactionsModule {}
