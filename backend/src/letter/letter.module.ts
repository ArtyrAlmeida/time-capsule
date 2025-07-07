import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entities/letter.entity';
import { LetterService } from './letter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Letter])],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
