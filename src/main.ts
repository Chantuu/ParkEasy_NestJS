import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieSession from 'cookie-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //#region Cookie Session Setup
  const configService = app.get<ConfigService>(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL'); // Get url of the frontend application to recieve requests
  const sessionSecret = configService.get<string>('SESSION_SECRET'); // Get Cookie Session Secret Key

  if (!sessionSecret) {
    throw new Error('SESSION_SECRET environment variable is not defined.');
  }
  app.use(
    cookieSession({
      keys: [sessionSecret], // Set Cookie Session Secret Key
      maxAge: 24 * 60 * 60 * 1000, // Cookie Session is valid for 24 hours
    }),
  );
  //#endregion

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Removes any properties not specified in DTOs
    }),
  );

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    httpOnly: true,
  });

  // Swagger OpenApi Documentation setup
  const openApiConfig = new DocumentBuilder()
    .setTitle('ParkEasy API')
    .addCookieAuth('session')
    .setDescription(
      'REST API for parking reservation management with real-time streaming updates using Server-Sent Events.',
    )
    .setVersion('1.0.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
