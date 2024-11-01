import { Module } from '@nestjs/common';
import { PostModule } from './admin/post/post.module';
import { AuthModule } from './admin/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    // MongooseModule.forRoot(configuration().database.url),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'), // Cambia según la ruta en tu archivo de configuración
        retryAttempts: 10,       // Reintentos de conexión
        retryDelay: 5000,        // Retraso entre reintentos en ms
        connectTimeoutMS: 30000, // Tiempo de espera de conexión en ms
        socketTimeoutMS: 45000,  // Tiempo de espera de socket en ms
      }),
    }),
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
