import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
    app.enableCors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    });
  
    app.use(
      '/uploads',
      express.static(join(process.cwd(), 'uploads')),
    );
  
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
