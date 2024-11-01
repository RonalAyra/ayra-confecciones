import { Module } from '@nestjs/common';
import { PostModule } from './admin/post/post.module';
import { AuthModule } from './admin/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './admin/users/users.module';
import { ProductModule } from './admin/products/product.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database.url),
    PostModule, 
    ProductModule, 
    AuthModule,
    UsersModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const controllerName = req.baseUrl.split('/')[2]; // Obteniendo el nombre del controlador
          const uploadPath = path.join('./uploads', controllerName);

          // Crear la carpeta si no existe
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix);
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule { }
