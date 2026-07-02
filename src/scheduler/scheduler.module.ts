import { Module } from '@nestjs/common';
import { MonitorsModule } from 'src/monitor/monitor.module';
import { RabbitmqModule } from 'src/rabbitmq/rabbitmq.module';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MonitorsModule,
    RabbitmqModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule { }