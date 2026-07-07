import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as amqp from 'amqplib';

import { LogsService } from 'src/logs/logs.service';

@Injectable()
export class WorkerService implements OnModuleInit {
    private connection: amqp.ChannelModel;
    private channel: amqp.Channel;

    constructor(
        private readonly logsService: LogsService,
        private readonly httpService: HttpService,
    ) { }

    async onModuleInit() {
        this.connection = await amqp.connect(
            process.env.RABBITMQ_URL || 'amqp://localhost',
        );

        this.channel = await this.connection.createChannel();

        const queue = 'ping_queue';

        await this.channel.assertQueue(queue, { durable: true });

        this.channel.consume(queue, async (msg) => {
            if (!msg) return;

            await this.handleMessage(msg);
        });
    }

    private async handleMessage(msg: amqp.Message) {
        const { monitorId, url, expectedStatusCode } = JSON.parse(
            msg.content.toString(),
        );

        const start = Date.now();

        try {
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    validateStatus: () => true,
                }),
            );

            const responseTime = Date.now() - start;

            await this.logsService.create({
                monitorId,
                statusCode: response.status,
                responseTime,
                success: response.status === expectedStatusCode,
            });
        } catch (e) {
            const responseTime = Date.now() - start;

            await this.logsService.create({
                monitorId,
                statusCode: 0,
                responseTime,
                success: false,
                error: e.message,
            });
        } finally {
            this.channel.ack(msg);
        }
    }
}