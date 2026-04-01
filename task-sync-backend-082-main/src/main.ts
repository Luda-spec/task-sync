import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://task-sync.vercel.app',
    'https://task-sync-khaki.vercel.app',
    /\.vercel\.app$/, 
  ],
  credentials: true,
  exposedHeaders: 'set-cookie',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
  
  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
