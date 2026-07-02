import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MonitorsService } from '../monitor/monitor.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class SchedulerService {
    constructor(
        private readonly monitorsService: MonitorsService,
        private readonly rabbitmqService: RabbitmqService,
    ) { }
    @Cron('*/10 * * * * *')
    async scheduleHealthChecks() {
        const monitors = await this.monitorsService.findAllActive();

        for (const monitor of monitors) {
            await this.rabbitmqService.publish({
                monitorId: (monitor as any)._id.toString(),
                url: monitor.url,
                expectedStatusCode: monitor.expectedStatusCode,
            });
        }
    }
}