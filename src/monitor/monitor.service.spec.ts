import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { MonitorsService } from './monitor.service';
import { Monitor } from './monitor.schema';

const mockMonitor = {
  _id: 'monitor123',
  name: 'monitor123',
  url: '/test',
  userId: 'user123',
  interval: 5,
  expectedStatusCode: 200,
  isActive: true,
};

const mockMonitorModel = {
  findById: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
};

describe('MonitorsService', () => {
  let service: MonitorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitorsService,
        {
          provide: getModelToken(Monitor.name),
          useValue: mockMonitorModel,
        },
      ],
    }).compile();

    service = module.get<MonitorsService>(MonitorsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a monitor', async () => {
      mockMonitorModel.create.mockResolvedValue(mockMonitor);

      const dto = {
        name: mockMonitor.name,
        url: mockMonitor.url,
        interval: mockMonitor.interval,
        expectedStatusCode: mockMonitor.expectedStatusCode,
        isActive: mockMonitor.isActive,
      };

      const result = await service.create(
        mockMonitor.userId,
        dto,
      );

      expect(mockMonitorModel.create).toHaveBeenCalledWith({
        ...dto,
        userId: mockMonitor.userId,
      });

      expect(result).toEqual(mockMonitor);
    });
  });

  describe('findById', () => {
    it('should return monitor by id', async () => {
      mockMonitorModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockMonitor),
      });

      const result = await service.findById(
        mockMonitor._id,
      );

      expect(mockMonitorModel.findById).toHaveBeenCalledWith(
        mockMonitor._id,
      );

      expect(result).toEqual(mockMonitor);
    });
  });

  describe('findAllByUser', () => {
    it('should return monitors of a user', async () => {
      const monitors = [mockMonitor];

      mockMonitorModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(monitors),
      });

      const result = await service.findAllByUser(
        mockMonitor.userId,
      );

      expect(mockMonitorModel.find).toHaveBeenCalledWith({
        userId: mockMonitor.userId,
      });

      expect(result).toEqual(monitors);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when monitor does not exist', async () => {
      mockMonitorModel.findOneAndUpdate.mockResolvedValue(
        null,
      );

      await expect(
        service.update(
          'nonexistent',
          'user123',
          { name: 'updated-monitor' },
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update monitor successfully', async () => {
      const updatedMonitor = {
        ...mockMonitor,
        name: 'updated-monitor',
      };

      mockMonitorModel.findOneAndUpdate.mockResolvedValue(
        updatedMonitor,
      );

      const result = await service.update(
        mockMonitor._id,
        mockMonitor.userId,
        {
          name: 'updated-monitor',
        },
      );

      expect(
        mockMonitorModel.findOneAndUpdate,
      ).toHaveBeenCalledWith(
        {
          _id: mockMonitor._id,
          userId: mockMonitor.userId,
        },
        {
          name: 'updated-monitor',
        },
        {
          new: true,
        },
      );

      expect(result).toEqual(updatedMonitor);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when monitor does not exist', async () => {
      mockMonitorModel.deleteOne.mockResolvedValue({
        deletedCount: 0,
      });

      await expect(
        service.delete('nonexistent', 'user123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should delete successfully when monitor exists', async () => {
      mockMonitorModel.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      await expect(
        service.delete(
          mockMonitor._id,
          mockMonitor.userId,
        ),
      ).resolves.toBeUndefined();

      expect(
        mockMonitorModel.deleteOne,
      ).toHaveBeenCalledWith({
        _id: mockMonitor._id,
        userId: mockMonitor.userId,
      });
    });
  });
});