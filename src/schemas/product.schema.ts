import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  its_sale: string;

  @Prop()
  status: string;

  @Prop()
  product_picture: string;

  @Prop()
  price: string;
}

export const productSchema = SchemaFactory.createForClass(Product);
export const ProductSchema = productSchema;
