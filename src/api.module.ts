import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { ProductModule } from './api/products/product.module';
import { HomeModule } from './api/Home/home.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`,
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    MongooseModule.forRoot(configuration().database.url),
    ProductModule,
    HomeModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}
