import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserInterceptor } from './auth/Interceptor/current_user.Interceptor';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './users/middlware/logger.middlware';
import { CurrentUserMiddleware } from './users/middlware/currentuser.middlware';

import { User } from './users/users.entity';
import { Order } from './orders/order.entity';
import { Product } from './products/products.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /*TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: 'localhost',
      username: 'postgres',
      password: '171199',
      database: 'Shop_db',
      entities: [User, Order, Product],
      autoLoadEntities: true,
      synchronize: true,
    }),*/ TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME') || 'Shop_db',
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production', // Only sync in development
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, CurrentUserMiddleware).forRoutes('*');
  }
}
