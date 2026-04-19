import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

async function test() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const key = configService.get('GROQ_API_KEY');
  console.log('GROQ_API_KEY from ConfigService:', key ? 'FOUND' : 'NOT FOUND');
  await app.close();
}
test();
