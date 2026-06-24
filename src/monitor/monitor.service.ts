import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMonitorDto, UpdateMonitorDto } from './dto/monitor.dto';
import { Monitor, MonitorDocument } from './monitor.schema';

@Injectable()
export class MonitorsService {

    constructor(
        @InjectModel(Monitor.name) private monitorModel: Model<MonitorDocument>,
    ) { }

    async findById(id: string): Promise<Monitor | null> {
        return this.monitorModel.findById(id).exec();
    }

    async create(userId: string, dto: CreateMonitorDto): Promise<Monitor> {
        return this.monitorModel.create({ ...dto, userId });
    }

    async findAllByUser(userId: string): Promise<Monitor[]> {
        return this.monitorModel.find({ userId }).sort({ createdAt: -1 });
    }

    async update(id: string, userId, dto: UpdateMonitorDto): Promise<Monitor> {
        const updated = await this.monitorModel.findOneAndUpdate(
            { _id: id, userId },
            dto,
            { new: true }
        );
        if (!updated) throw new NotFoundException('Monitor not found or unauthorized');
        return updated;
    }

    async delete(id: string, userId: string): Promise<void> {
        const result = await this.monitorModel.deleteOne({ _id: id, userId });
        if (result.deletedCount === 0)
            throw new NotFoundException('Monitor not found or unauthorized');
    }
}
