import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProductSchema } from 'src/schemas/product.schema';

@Module({
  imports: [
    NestjsFormDataModule,
    MongooseModule.forFeature([
      { name: 'Products', schema: ProductSchema },
    ]),
   
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}

