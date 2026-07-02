import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { MonitorsService } from '../monitor/monitor.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const monitorsService = {
    findAllActive: jest.fn(),
  };

  const rabbitmqService = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: MonitorsService,
          useValue: monitorsService,
        },
        {
          provide: RabbitmqService,
          useValue: rabbitmqService,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should publish one message for each active monitor', async () => {
    monitorsService.findAllActive.mockResolvedValue([
      {
        _id: '1',
        url: 'https://example.com',
        expectedStatusCode: 200,
      },
      {
        _id: '2',
        url: 'https://google.com',
        expectedStatusCode: 204,
      },
    ]);

    rabbitmqService.publish.mockResolvedValue(undefined);

    await service.scheduleHealthChecks();

    expect(monitorsService.findAllActive).toHaveBeenCalledTimes(1);

    expect(rabbitmqService.publish).toHaveBeenCalledTimes(2);

    expect(rabbitmqService.publish).toHaveBeenNthCalledWith(1, {
      monitorId: '1',
      url: 'https://example.com',
      expectedStatusCode: 200,
    });

    expect(rabbitmqService.publish).toHaveBeenNthCalledWith(2, {
      monitorId: '2',
      url: 'https://google.com',
      expectedStatusCode: 204,
    });
  });

  it('should not publish anything when there are no active monitors', async () => {
    monitorsService.findAllActive.mockResolvedValue([]);

    await service.scheduleHealthChecks();

    expect(monitorsService.findAllActive).toHaveBeenCalledTimes(1);
    expect(rabbitmqService.publish).not.toHaveBeenCalled();
  });
});