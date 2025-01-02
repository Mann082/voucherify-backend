import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Redemption extends Document {
  @Prop({ required: true })
  voucherCode: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: Date, default: Date.now })
  redeemedAt: Date;

  @Prop()
  orderId: string;

  @Prop({ required: true })
  discountApplied: number;
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption);
