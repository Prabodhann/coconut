import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureCloudinary } from './config/cloudinary';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureCloudinary();
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : '*',
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap().catch((err) => console.error(err));
