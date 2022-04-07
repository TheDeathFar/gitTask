import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { ClassConstructor } from 'class-transformer';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';

@EventSubscriber()
export class ItemSubscriber implements EntitySubscriberInterface<ItemEntity> {
  listenTo(): ClassConstructor<any> | string {
    return ItemEntity;
  }

  // Удалим все трейдофферы с измененной вещью, потому что
  // могли поменяться категории, важная информация, и т.д.
  // Причем, при изменении фотографий трейдофферы не удалятся
  public async afterUpdate(
    event: UpdateEvent<ItemEntity>,
  ): Promise<any | void> {
    const manager = event.manager;
    const item = event.entity;
    const itemTradeoffer = await manager.find(TradeOfferEntity, {
      where: [
        {
          offered_item: item,
        },
        {
          desired_item: item,
        },
      ],
    });
    await manager.remove(itemTradeoffer);

    return event.databaseEntity;
  }
}
