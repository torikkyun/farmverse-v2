import { ContractDto } from '@shared/dtos/contract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

class TreeDto {
  @IsString()
  @ApiProperty({ required: true, example: '6882de9da2a432267d0d98dd' })
  itemId: string;

  @IsNumber()
  @ApiProperty({ required: true, example: 2 })
  quantity: number;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ required: true, example: true })
  iot: boolean;
}

export class CreateContractDto {
  @ValidateNested({ each: true })
  @Type(() => TreeDto)
  @ApiProperty({ type: [TreeDto], required: true })
  items: TreeDto[];

  @IsNotEmpty()
  @ApiProperty({ type: ContractDto, required: true })
  contract: ContractDto;
}
