import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

const mockUserService = {
  create: jest.fn((dto) => {
    return {
      id: Date.now(),
      ...dto,
    };
  }),
  verifyEmail: jest.fn(),
  checkVerification: jest.fn((username) => {
    if (username === 'mikailSahin') {
      return 'user is verified';
    } else {
      return 'user is not verified';
    }
  }),
};

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'mikailSahin',
        email: 'mikailsahin@gmail.com',
      };
      expect(await userController.register(createUserDto)).toEqual({
        id: expect.any(Number),
        ...createUserDto,
      });
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('verifyEmail', () => {
    it('should verify a user email', async () => {
      const result = await userController.verifyEmail(
        'mikailSahin',
        '0ccfbb63be9dde80eb7b6c6f26be2b5c',
      );
      expect(result).toEqual({ message: 'Email verified successfully' });
      expect(mockUserService.verifyEmail).toHaveBeenCalledWith(
        'mikailSahin',
        '0ccfbb63be9dde80eb7b6c6f26be2b5c',
      );
    });
  });

  describe('checkVerification', () => {
    it('should return user is verified', async () => {
      const result = await userController.checkVerification('mikailSahin');
      expect(result).toEqual({ message: 'user is verified' });
      expect(mockUserService.checkVerification).toHaveBeenCalledWith(
        'mikailSahin',
      );
    });

    it('should return user is not verified', async () => {
      const result = await userController.checkVerification('unverifiedUser');
      expect(result).toEqual({ message: 'user is not verified' });
      expect(mockUserService.checkVerification).toHaveBeenCalledWith(
        'unverifiedUser',
      );
    });
  });
});
