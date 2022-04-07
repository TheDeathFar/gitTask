import { ValidationPipe } from '@nestjs/common';

require(`dotenv`).config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3001;
const corsOrigin = process.env[`CORS_ORIGIN_REGEX`];

(async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: corsOrigin ? new RegExp(corsOrigin) : `*` });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log(
    `Application is running on: ${(await app.getUrl()).replace(
      `[::1]`,
      `localhost`,
    )}`,
  );
})();
