import { PartialType } from '@nestjs/mapped-types';
import { CreateLetterDto } from './createLetter.dto';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateLetterDto extends PartialType(CreateLetterDto) {
  @IsDate()
  @IsNotEmpty()
  @IsOptional()
  openedAt?: Date;

  @IsBoolean()
  @IsOptional()
  isOpen?: boolean;

  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}
