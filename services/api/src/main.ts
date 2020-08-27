import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  if (process.env.NODE_ENV === 'dev') {
    app.enableCors();
  }

  await app.listen(parseInt(process.env.API_PORT) || 3000, '0.0.0.0');
}
bootstrap();
