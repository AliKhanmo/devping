import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MonitorDocument = Monitor & Document;

@Schema({ timestamps: true })
export class Monitor {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    interval: number;

    @Prop({ default: 200 })
    expectedStatusCode: number;

    @Prop({ default: true })
    isActive: boolean;
}
export const MonitorSchema = SchemaFactory.createForClass(Monitor);