import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['*', 'http://localhost:3000','https://voucherify-frontend.vercel.app','https://vounew.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept , Authorization',
    credentials: true, 
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
