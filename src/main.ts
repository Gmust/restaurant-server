import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';
import rawBodyMiddleware from './middleware/rawBodyMiddleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Restaurant api')
    .setDescription('Api for restaurant app')
    .setVersion('1.0')
    .addServer(process.env.BACKEND_DEV_URL, 'Local environment')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.use(rawBodyMiddleware());
  app.useStaticAssets(join(__dirname, '../dishes', 'images'));
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.enableCors({ origin: 'https://restaurant-client-ebon.vercel.app', credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}

bootstrap();
