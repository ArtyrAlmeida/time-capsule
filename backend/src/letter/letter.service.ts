import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) {}

  async getLetters() {
    const letters = await this.letterRepository.find();
    return letters;
  }

  async getLetter(id: string) {
    const letter = await this.letterRepository.findOne({
      where: { id },
    });
    return letter;
  }

  createLetter(): string {
    return 'Letter created successfully';
  }

  updateLetter(id: string, updateBody: { field: string }): string {
    Logger.log(`Updating letter with ID: ${id} and field: ${updateBody.field}`);
    return `Letter with ID ${id} updated successfully`;
  }
}
