import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { Repository } from 'typeorm';
import { CreateLetterDto } from './dtos/createLetter.dto';
import { UpdateLetterDto } from './dtos/updateLetter.dto';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepository: Repository<Letter>,
  ) {}

  async getLetters() {
    try {
      const letters = await this.letterRepository.find();
      return letters;
    } catch (error) {
      Logger.error(`Error getting letters`, error);
      throw new InternalServerErrorException(`Failed to get letters`);
    }
  }

  async getLetter(id: string) {
    try {
      const letter = await this.letterRepository.findOneBy({ id });

      if (!letter) {
        throw new NotFoundException(`Letter with ID ${id} not found`);
      }

      return letter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      Logger.error(`Error updating letter with ID ${id}`, error);
      throw new InternalServerErrorException(`Failed to get letter`);
    }
  }

  async createLetter(body: CreateLetterDto) {
    try {
      const createdLetter = this.letterRepository.create(body);
      await this.letterRepository.save(createdLetter);
      return createdLetter;
    } catch (error) {
      Logger.error(`Error creating letter`, error);
      throw new InternalServerErrorException(`Failed to create letter`);
    }
  }

  async updateLetter(id: string, updateBody: UpdateLetterDto) {
    try {
      const updateResult = await this.letterRepository.update(
        { id },
        updateBody,
      );

      if (updateResult.affected === 0) {
        throw new NotFoundException(`Letter with ID ${id} not found`);
      }

      const updatedLetter = await this.letterRepository.findOneBy({ id });

      return updatedLetter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      Logger.error(`Error updating letter with ID ${id}`, error);
      throw new InternalServerErrorException(`Failed to update letter`);
    }
  }

  async deleteLetter(id: string) {
    try {
      const deleteResult = await this.letterRepository.delete({ id });
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Letter with ID ${id} not found`);
      }

      return { message: `Letter with ID ${id} deleted successfully`, id };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      Logger.error(`Error updating letter with ID ${id}`, error);
      throw new InternalServerErrorException(`Failed to update letter`);
    }
  }
}
