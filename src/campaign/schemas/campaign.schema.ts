import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Campaign extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: false })
  endDate: Date;

  @Prop([{ type: String, ref: 'Voucher' }])
  vouchers: string[];
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
