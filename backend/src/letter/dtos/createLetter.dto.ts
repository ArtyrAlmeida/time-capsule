import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLetterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  readonly content: string;

  @IsDateString()
  @IsNotEmpty()
  readonly openAt: string;
}
