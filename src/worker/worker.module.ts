import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { WorkerService } from './worker.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [
    HttpModule,
    LogsModule,
  ],
  providers: [WorkerService],
})
export class WorkerModule { }