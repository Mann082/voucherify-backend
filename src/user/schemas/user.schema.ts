import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'CUSTOMER' })
  role: 'ADMIN' | 'CUSTOMER';
}

export const UserSchema = SchemaFactory.createForClass(User);
