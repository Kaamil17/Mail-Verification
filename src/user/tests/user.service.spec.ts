import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interfaces';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUser = {
  _id: '665648cb92122d143164c4cf',
  username: 'mikailSahin',
  email: 'mikailsahin@gmail.com',
  verificationToken: '0ccfbb63be9dde80eb7b6c6f26be2b5c',
  isVerified: true,
  save: jest.fn().mockResolvedValue(this),
};

const mockUserModel = {
  new: jest.fn().mockResolvedValue(mockUser),
  constructor: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() =>
        Promise.resolve({
          ...mockUser,
          save: jest.fn().mockResolvedValue(mockUser),
        } as any),
      );
      const newUser = await service.create({
        username: 'newUser',
        email: 'newuser@example.com',
      });
      expect(newUser).toEqual(mockUser);
    });

    it('should throw an error if user already exists', async () => {
      jest.spyOn(model, 'create').mockImplementationOnce(() => {
        const error = new Error('Duplicate key error');
        error.name = 'MongoError';
        error.message = '11000';
        throw error;
      });

      await expect(
        service.create({
          username: 'mikailSahin',
          email: 'mikailsahin@gmail.com',
        }),
      ).rejects.toThrow('Duplicate key error');
    });
  });

  describe('verifyEmail', () => {
    it('should verify user email', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          verificationToken: '0ccfbb63be9dde80eb7b6c6f26be2b5c',
          isVerified: false,
          save: jest.fn().mockResolvedValue({ ...mockUser, isVerified: true }),
        }),
      } as any);
      await service.verifyEmail(
        'mikailSahin',
        '0ccfbb63be9dde80eb7b6c6f26be2b5c',
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.verifyEmail('unknown', 'testtoken')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if token does not match', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue({
          ...mockUser,
          verificationToken: 'wrongtoken',
        }),
      } as any);
      await expect(
        service.verifyEmail('mikailSahin', 'testtoken'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkVerification', () => {
    it('should return user verification status', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      const status = await service.checkVerification('mikailSahin');
      expect(status).toEqual('user is verified');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.checkVerification('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
