import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '#src/modules/auth/guards/jwt-auth.guard';
import { UploadsModule } from '#src/modules/uploads/uploads.module';
import { JwtModule } from '@nestjs/jwt';
import { UserItemsModule } from './modules/user-items/user-items.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MockModule } from './modules/mock/mock.module';
import { CatalogueModule } from './modules/catalogue/catalogue.module';
import { ItemModule } from '#src/modules/item/item.module';
import { TradeModule } from '#src/modules/trade/trade.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
    UploadsModule,
    {
      ...JwtModule.register({
        secret: process.env[`JWT_SECRET_TOKEN`],
      }),
      global: true,
    },
    UserItemsModule,
    AccountsModule,
    CategoriesModule,
    MockModule,
    CatalogueModule,
    ItemModule,
    TradeModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
