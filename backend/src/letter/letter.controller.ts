import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LetterService } from './letter.service';
import { CreateLetterDto } from './dtos/createLetter.dto';
import { UpdateLetterDto } from './dtos/updateLetter.dto';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}
  @Get()
  getLetters() {
    return this.letterService.getLetters();
  }

  @Get(':id')
  getLetterById(@Param('id') id: string) {
    return this.letterService.getLetter(id);
  }

  @Post()
  createLetter(@Body() body: CreateLetterDto) {
    return this.letterService.createLetter(body);
  }

  @Patch(':id')
  updateLetter(@Param('id') id: string, @Body() updateBody: UpdateLetterDto) {
    return this.letterService.updateLetter(id, updateBody);
  }

  @Delete(':id')
  deleteLetter(@Param('id') id: string) {
    return this.letterService.deleteLetter(id);
  }
}
