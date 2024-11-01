import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';
import { ApiModule } from './api.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import * as express from 'express'; 
import * as bodyParser from 'body-parser'; 

async function bootstrap() {
  const server = express();
  
  server.use(bodyParser.json({ limit: '50mb' })); // Establece el límite del tamaño del cuerpo de la solicitud
  server.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // También para las solicitudes codificadas en URL
  
  const adapter = new ExpressAdapter(server);
  const api = await NestFactory.create(ApiModule, adapter);
  const admin = await NestFactory.create(AdminModule, adapter);

  api.enableShutdownHooks();
  admin.enableShutdownHooks();

  // Definir las opciones de CORS
  const corsOptions = {
      origin: '*', // Cambia esto a tu dominio específico si es necesario
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
  };

  api.enableCors(corsOptions);
  admin.enableCors(corsOptions);

  api.setGlobalPrefix('api/v1');
  admin.setGlobalPrefix('api/admin/v1');

  const validatorOptions = { stopAtFirstError: true };

  api.useGlobalPipes(new ValidationPipe(validatorOptions));
  admin.useGlobalPipes(new ValidationPipe(validatorOptions));

  await Promise.all([api.init(), admin.init()]);
  await adapter.listen(configuration().port);
}

bootstrap();
