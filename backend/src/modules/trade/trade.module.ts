import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TradeOfferEntity, ItemEntity])],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
