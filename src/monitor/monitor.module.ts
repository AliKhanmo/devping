import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { MonitorsController } from './monitor.controller';
import { Monitor, MonitorSchema } from './monitor.schema';
import { MonitorsService } from './monitor.service';
@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Monitor.name, schema: MonitorSchema }])],
  controllers: [MonitorsController],
  providers: [MonitorsService],
})
export class MonitorsModule { }
