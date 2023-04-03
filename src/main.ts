import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('hauhauhauhauhauhauahauhauahauhauahuahauhaua');
  // Auto-validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PJX API')
    .setDescription('PJX API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Swagger Options
  const swaggerOptions: SwaggerCustomOptions = {
    customCss: `
        .topbar-wrapper img {
          content:url(${process.env.LOGO_BRANCA_PAGSTAR_PNG});
        }
        .swagger-ui .topbar { background-color: #027BD8D3; }
      `,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, swaggerOptions);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
