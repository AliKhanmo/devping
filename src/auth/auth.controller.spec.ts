import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return result', async () => {
      const dto = { email: 'test@test.com', password: '123456' };

      const result = { id: '1', email: dto.email };

      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(dto as any)).toEqual(result);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('login', () => {
    it('should return token when credentials are valid', async () => {
      const dto = { email: 'test@test.com', password: '123456' };

      const user = { id: '1', email: dto.email };
      const tokenResult = { access_token: 'jwt-token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(tokenResult);

      const result = await controller.login(dto as any);

      expect(result).toEqual(tokenResult);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException when user is invalid', async () => {
      const dto = { email: 'test@test.com', password: 'wrong' };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(dto as any)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });
});