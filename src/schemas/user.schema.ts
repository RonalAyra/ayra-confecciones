import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone_number: string;

  @Prop()
  profile_picture: string;

  @Prop()
  user_role: string;

  @Prop()
  status: string;

  @Exclude()
  __v: number;
}

export const userSchema = SchemaFactory.createForClass(User);

userSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await hash(this.password, 10);
  }
  if (!this.status) {
    this.status = 'pending';
  }
});

userSchema.pre('findOneAndUpdate', async function () {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user: any = this;

  if (user._update.password) {
    user._update.password = await hash(user._update.password, 10);
  }
});
export const UserSchema = userSchema;
