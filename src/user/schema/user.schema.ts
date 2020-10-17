import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ type: [String], required: true })
  scope: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
