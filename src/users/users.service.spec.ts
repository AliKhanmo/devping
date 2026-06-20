import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { ConflictException } from '@nestjs/common';

const mockUser = {
  _id: 'user123',
  email: 'ali@test.com',
  password: 'hashed_password',
};

const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user when email does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(mockUser);

      const dto = { email: mockUser.email, password: mockUser.password };

      const result = await service.create(dto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: dto.email,
      });

      expect(mockUserModel.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const dto = { email: mockUser.email, password: mockUser.password };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findByEmail(mockUser.email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: mockUser.email,
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById(mockUser._id);

      expect(mockUserModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });
  });
});