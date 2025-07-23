/* eslint-disable @typescript-eslint/unbound-method */
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { LetterService } from './letter.service';
import { Letter } from './entities/letter.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLetterDto } from './dtos/createLetter.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('LetterService', () => {
  let letterService: LetterService;
  let letterRepository: Repository<Letter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LetterService,
        {
          provide: getRepositoryToken(Letter),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    letterService = module.get<LetterService>(LetterService);
    letterRepository = module.get<Repository<Letter>>(
      getRepositoryToken(Letter),
    );
  });

  it('should be defined', () => {
    expect(letterService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new person', async () => {
      const createLetterDTO: CreateLetterDto = {
        content: 'lorem ipsum',
        openAt: '2025',
        title: 'lorem ipsum',
      };

      const date = new Date();

      const newLetter: Letter = {
        ...createLetterDTO,
        createdAt: date,
        updatedAt: date,
        id: '1',
        isDeleted: false,
        isOpen: false,
        openedAt: null,
        openAt: date,
      };

      jest.spyOn(letterRepository, 'create').mockReturnValue(newLetter);

      const result = await letterService.createLetter(createLetterDTO);

      expect(letterRepository.create).toHaveBeenCalledWith(createLetterDTO);
      expect(letterRepository.save).toHaveBeenCalledWith(newLetter);
      expect(result).toEqual(newLetter);
    });

    it('should throw InternalServerError exception when value is invalid', async () => {
      jest.spyOn(letterRepository, 'create').mockImplementation(() => {
        throw new Error();
      });

      await expect(
        letterService.createLetter({} as CreateLetterDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getLetter', () => {
    it('should return letter if is found', async () => {
      const date = new Date();
      const id = '1';
      const mockLetter: Letter = {
        id,
        content: '',
        createdAt: date,
        isDeleted: false,
        isOpen: false,
        openAt: date,
        openedAt: date,
        updatedAt: date,
        title: 'MockedLetter',
      };

      jest.spyOn(letterRepository, 'findOneBy').mockResolvedValue(mockLetter);

      const result = await letterService.getLetter(id);

      expect(letterRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockLetter);
    });

    it('should throw NotFoundException when letter is not found', async () => {
      const id = '1';
      jest.spyOn(letterRepository, 'findOneBy').mockResolvedValue(null);

      await expect(letterService.getLetter(id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerError exception when repository throws error', async () => {
      const id = '1';
      jest.spyOn(letterRepository, 'findOneBy').mockImplementation(() => {
        throw new Error();
      });

      await expect(letterService.getLetter(id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getLetters', () => {
    it('should return letter array if found', async () => {
      const date = new Date();
      const id = '1';
      const mockLetter: Letter = {
        id,
        content: '',
        createdAt: date,
        isDeleted: false,
        isOpen: false,
        openAt: date,
        openedAt: date,
        updatedAt: date,
        title: 'MockedLetter',
      };

      const mockLetterArr = [mockLetter, mockLetter];

      jest.spyOn(letterRepository, 'find').mockResolvedValue(mockLetterArr);

      const result = await letterService.getLetters();

      expect(letterRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockLetterArr);
    });

    it('should throw InternalServerError exception when repository throws error', async () => {
      jest.spyOn(letterRepository, 'find').mockImplementation(() => {
        throw new Error();
      });

      await expect(letterService.getLetters()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateLetter', () => {
    it('should update and return the updated letter', async () => {
      const id = '1';
      const updateBody = { title: 'Updated Title' };
      const date = new Date();
      const updatedLetter: Letter = {
        id,
        content: '',
        createdAt: date,
        isDeleted: false,
        isOpen: false,
        openAt: date,
        openedAt: date,
        updatedAt: date,
        title: 'Updated Title',
      };

      jest
        .spyOn(letterRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      jest
        .spyOn(letterRepository, 'findOneBy')
        .mockResolvedValue(updatedLetter);

      const result = await letterService.updateLetter(id, updateBody);

      expect(letterRepository.update).toHaveBeenCalledWith({ id }, updateBody);
      expect(letterRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(updatedLetter);
    });

    it('should throw NotFoundException if letter not found', async () => {
      jest
        .spyOn(letterRepository, 'update')
        .mockResolvedValue({ affected: 0 } as UpdateResult);

      await expect(letterService.updateLetter('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      jest.spyOn(letterRepository, 'update').mockImplementation(() => {
        throw new Error();
      });

      await expect(letterService.updateLetter('1', {})).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteLetter', () => {
    it('should delete and return success message', async () => {
      jest
        .spyOn(letterRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as DeleteResult);

      const result = await letterService.deleteLetter('1');

      expect(letterRepository.delete).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual({
        message: `Letter with ID 1 deleted successfully`,
        id: '1',
      });
    });

    it('should throw NotFoundException if letter not found', async () => {
      jest
        .spyOn(letterRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as DeleteResult);

      await expect(letterService.deleteLetter('1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on repository error', async () => {
      jest.spyOn(letterRepository, 'delete').mockImplementation(() => {
        throw new Error();
      });

      await expect(letterService.deleteLetter('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
