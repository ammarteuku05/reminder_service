import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true })
  timezone: string;

  @Prop({ default: null })
  deleted_at: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
