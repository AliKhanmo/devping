import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleInit {
    private connection: amqp.ChannelModel;
    private channel: amqp.Channel;
    private readonly queue = 'ping_queue';

    async onModuleInit() {
        this.connection = await amqp.connect(
            'amqp://guest:guest@localhost:5672',
        );

        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(this.queue, {
            durable: true,
        });
    }

    async publish(message: object): Promise<void> {
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(message)))
    }
}