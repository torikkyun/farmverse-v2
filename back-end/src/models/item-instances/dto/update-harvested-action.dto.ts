import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { HarvestedAction } from 'generated/prisma/wasm';
import { ItemInstanceValidationMessages } from 'src/common/constants/item-instance-validation-msg';

export class UpdateHarvestedActionDto {
  @IsNotEmpty({
    message: ItemInstanceValidationMessages.HARVESTED_ACTION.NOT_EMPTY,
  })
  @IsEnum(HarvestedAction, {
    message: ItemInstanceValidationMessages.HARVESTED_ACTION.MUST_BE_ENUM,
  })
  @ApiProperty({
    required: true,
    enum: HarvestedAction,
  })
  harvestedAction: HarvestedAction;
}
