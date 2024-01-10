import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Bookklub API')
    .setDescription('The API for bookklub app')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
