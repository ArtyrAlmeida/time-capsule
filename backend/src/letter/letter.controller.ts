import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LetterService } from './letter.service';

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
  createLetter() {
    return this.letterService.createLetter();
  }

  @Patch(':id')
  updateLetter(@Param('id') id: string, @Body() updateBody: { field: string }) {
    return this.letterService.updateLetter(id, updateBody);
  }
}
