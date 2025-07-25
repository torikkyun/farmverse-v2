import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { EmailVerificationDto } from './email-verification.dto';
import { UserValidationMessages } from '@app/common/constants/user-validation-msg';

export class LoginDto extends EmailVerificationDto {
  @IsNotEmpty({ message: UserValidationMessages.PASSWORD.NOT_EMPTY })
  @IsString({ message: UserValidationMessages.PASSWORD.MUST_BE_STRING })
  @MinLength(6, { message: UserValidationMessages.PASSWORD.MIN_LENGTH })
  @MaxLength(15, { message: UserValidationMessages.PASSWORD.MAX_LENGTH })
  @ApiProperty({
    example: '123456',
  })
  password: string;
}
