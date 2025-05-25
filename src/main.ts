import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(
    session({
      secret: '17119929911171100218',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: false,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
