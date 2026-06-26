import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { MonitorsController } from './monitor.controller';
import { MonitorsService } from './monitor.service';
import { CreateMonitorDto, UpdateMonitorDto } from './dto/monitor.dto';
import { RequestWithUser } from 'src/common/types';
import { AuthGuard } from 'src/auth/auth.guard';

describe('MonitorsController', () => {
  let controller: MonitorsController;
  let service: jest.Mocked<MonitorsService>;

  const mockService = {
    findAllByUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const request = {
    user: {
      userId: 'user123',
    },
  } as RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorsController],
      providers: [
        {
          provide: MonitorsService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MonitorsController>(MonitorsController);
    service = module.get(MonitorsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all monitors', async () => {
      const monitors = [{ id: '1', name: 'API Monitor' }];
      service.findAllByUser.mockResolvedValue(monitors as any);

      const result = await controller.findAll(request);

      expect(service.findAllByUser).toHaveBeenCalledWith('user123');
      expect(result).toEqual(monitors);
    });

    it('should throw UnauthorizedException when userId is missing', async () => {
      await expect(
        controller.findAll({} as RequestWithUser),
      ).rejects.toThrow(UnauthorizedException);

      expect(service.findAllByUser).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a monitor', async () => {
      const dto: CreateMonitorDto = {
        name: 'API',
        url: 'https://example.com',
      } as CreateMonitorDto;

      const monitor = { id: '1', ...dto };

      service.create.mockResolvedValue(monitor as any);

      const result = await controller.create(request, dto);

      expect(service.create).toHaveBeenCalledWith('user123', dto);
      expect(result).toEqual(monitor);
    });

    it('should throw UnauthorizedException when userId is missing', async () => {
      await expect(
        controller.create({} as RequestWithUser, {} as CreateMonitorDto),
      ).rejects.toThrow(UnauthorizedException);

      expect(service.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a monitor', async () => {
      const dto: UpdateMonitorDto = {
        name: 'Updated Monitor',
      } as UpdateMonitorDto;

      const updated = { id: '1', ...dto };

      service.update.mockResolvedValue(updated as any);

      const result = await controller.update('1', request, dto);

      expect(service.update).toHaveBeenCalledWith(
        '1',
        'user123',
        dto,
      );
      expect(result).toEqual(updated);
    });

    it('should throw UnauthorizedException when userId is missing', () => {
      expect(() =>
        controller.update(
          '1',
          {} as RequestWithUser,
          {} as UpdateMonitorDto,
        ),
      ).toThrow(UnauthorizedException);

      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a monitor', async () => {
      service.delete.mockResolvedValue({
        message: 'Monitor deleted',
      } as any);

      const result = await controller.delete('1', request);

      expect(service.delete).toHaveBeenCalledWith(
        '1',
        'user123',
      );
      expect(result).toEqual({
        message: 'Monitor deleted',
      });
    });

    it('should throw UnauthorizedException when userId is missing', () => {
      expect(() =>
        controller.delete('1', {} as RequestWithUser),
      ).toThrow(UnauthorizedException);

      expect(service.delete).not.toHaveBeenCalled();
    });
  });
});