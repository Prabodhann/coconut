import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureCloudinary } from './config/cloudinary';
import { json, urlencoded, raw } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureCloudinary();

  // Set Global Patterns
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Stripe webhook needs raw body for signature verification — must come before json()
  app.use('/api/order/webhook', raw({ type: 'application/json' }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : '*',
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap().catch((err) => console.error(err));
