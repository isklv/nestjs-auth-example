import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import config from './config/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (['production', 'test'].indexOf(process.env.NODE_ENV) > -1) {
    app.set('trust proxy', 1);
  }
  app.use(
    helmet({
      referrerPolicy: { policy: 'no-referrer-when-downgrade' },
    }),
  );
  app.use(cookieParser());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 1000, // 1 second
      max: 10, // limit each IP to 10 requests per windowMs
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('user')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(config().port);
}
bootstrap();
