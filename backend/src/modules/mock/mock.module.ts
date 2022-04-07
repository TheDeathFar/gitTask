import { Module } from '@nestjs/common';
import { MockController } from './mock.controller';
import { MockService } from './mock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { Profile } from '#src/modules/user/entity/profile.entity';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      CategoryEntity,
      ItemEntity,
      PhotoEntity,
      TradeOfferEntity,
    ]),
  ],
  controllers: [MockController],
  providers: [MockService],
})
export class MockModule {}
