import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', 1);
  app.enableCors();
  // app.use(helmet()); // TODO - Should be enabled after SSL
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // Enable Validations
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // OpenAPI Document Configuration
  const options = new DocumentBuilder()
    .setTitle('QR Menu API')
    .setDescription('The complete Open API document for QR Menu API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
