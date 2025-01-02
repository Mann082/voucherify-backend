import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Voucher extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  type: 'PERCENTAGE' | 'AMOUNT';

  @Prop({ required: true })
  value: number;

  @Prop({ default: null })
  maxLimit: number;

  @Prop({ default: 1 })
  maxUsage: number;

  @Prop({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'EXPIRED' | 'USED';

  @Prop({ type: Date, default: null })
  expirationDate: Date;

  @Prop({ default: 0 })
  usageCount: number;

  @Prop({ type: String, ref: 'Campaign' })
  campaignId: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
