import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;

  const config = new DocumentBuilder()
    .setTitle('NestJS Course')
    .setDescription('The NestJS Course API description')
    .setVersion('1.0.0')
    .addTag('NestJS Course')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => {
    Logger.log(`Server running on http://localhost:${PORT}`, 'NestApplication');
  });
}
void bootstrap();
