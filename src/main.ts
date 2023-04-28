import { NestFactory } from '@nestjs/core';
import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';

async function bootstrap() {
  const logger = [...(process.env.LOG_LEVELS.split(',') as LogLevel[])];
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('The Session Manager')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document);

  const configService: ConfigService = app.get(ConfigService);
  const { port } = configService.get('app');
  await app.listen(port);
}
bootstrap();
