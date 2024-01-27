import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Restaurant api')
    .setDescription('Api for restaurant app')
    .setVersion('1.0')
    .addServer('http://localhost:8080/', 'Local environment')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useStaticAssets(join(__dirname, '../dishes', 'images'));
  app.enableCors({ credentials: true });
  await app.listen(8080);
}

bootstrap();
