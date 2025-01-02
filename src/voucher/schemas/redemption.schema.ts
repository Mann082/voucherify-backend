import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Redemption extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Voucher', required: true })
  voucherId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ default: Date.now })
  lastRedeemedAt: Date;
}

export const RedemptionSchema = SchemaFactory.createForClass(Redemption);
