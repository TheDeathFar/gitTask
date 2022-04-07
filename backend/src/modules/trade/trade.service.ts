import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';
import { Not, Repository } from 'typeorm';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { User } from '#src/modules/user/entity/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { TradeoffersListDto } from '#server/common/dto/tradeoffers-list.dto';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';
import { appPaginate } from '#src/util/app-paginate';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(TradeOfferEntity)
    private tradeoffersRepository: Repository<TradeOfferEntity>,
    @InjectRepository(ItemEntity)
    private itemsRepository: Repository<ItemEntity>,
  ) {}

  private async getPaginatedTradeoffers(
    user: User,
    props: PaginationRequestDto,
    associatedItem: `offered_item` | `desired_item`,
  ): Promise<TradeoffersListDto> {
    const { query = `` } = props;

    const paginatedTO = await appPaginate(
      this.tradeoffersRepository,
      props,
      {
        [associatedItem]: {
          user: {
            id: user.id,
          },
        },
        [Symbol(`AND (.. OR .. OR ..)`)]: [
          {
            sql: `$currentName_offered_item.name LIKE :offeredLike`,
            params: {
              offeredLike: `%${query}%`,
            },
          },
          {
            sql: `$currentName_desired_item.name LIKE :desiredLike`,
            params: {
              desiredLike: `%${query}%`,
            },
          },
        ],
      },
      {
        autoJoin: true,
        relations: [
          `desired_item`,
          `desired_item.item_category`,
          `desired_item.trade_category`,
          `desired_item.user`,
          `offered_item`,
          `offered_item.item_category`,
          `offered_item.trade_category`,
          `offered_item.user`,
        ],
      },
    );

    return new Pagination<TradeofferDto>(
      paginatedTO.items.map((item: TradeOfferEntity) => item.toDto()),
      paginatedTO.meta,
    );
  }

  async getUserOwnedTradeoffers(
    user: User,
    props: PaginationRequestDto,
  ): Promise<TradeoffersListDto> {
    return await this.getPaginatedTradeoffers(user, props, `offered_item`);
  }

  async getUserIncomingTradeoffers(
    user: User,
    props: PaginationRequestDto,
  ): Promise<TradeoffersListDto> {
    return await this.getPaginatedTradeoffers(user, props, `desired_item`);
  }

  async getTradeoffer(user: User, id: number): Promise<TradeOfferEntity> {
    return await this.tradeoffersRepository.findOne({
      where: { id, user },
      relations: [``],
    });
  }

  async createTradeoffer(
    user: User,
    createTradeofferDto: CreateTradeofferDto,
  ): Promise<TradeOfferEntity> {
    const { offered_item_id, desired_item_id } = createTradeofferDto;
    const offeredItem = await this.itemsRepository.findOne(offered_item_id, {
      relations: [
        `to_where_offered`,
        `user`,
        `photos`,
        `item_category`,
        `trade_category`,
      ],
    });
    const desiredItem = await this.itemsRepository.findOne(desired_item_id, {
      relations: [`user`, `photos`, `item_category`, `trade_category`],
    });

    // Базовые проверки на существование, принадлежность, возможность выложить

    if (!offeredItem || !desiredItem)
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_ITEM);

    if (offeredItem.user_id !== user.id)
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_ITEM);

    if (desiredItem.user_id === user.id)
      throw new BadRequestException(ErrorMessagesEnum.CANT_DESIRE_YOUR_ITEM);

    if (offeredItem.to_where_offered)
      throw new BadRequestException(ErrorMessagesEnum.ITEM_ALREADY_OFFERED);

    // Проверка на соответствие категорий

    if (
      offeredItem.item_category_id !== desiredItem.trade_category_id ||
      offeredItem.trade_category_id !== desiredItem.item_category_id
    )
      throw new BadRequestException(ErrorMessagesEnum.MISMATCHED_CATEGORIES);

    // Создание трейдоффера

    const newTradeoffer = this.tradeoffersRepository.create({
      offered_item: offeredItem,
      desired_item: desiredItem,
    });

    await this.tradeoffersRepository.save(newTradeoffer);

    return newTradeoffer;
  }

  async getAvailableItems(user: User, id: number): Promise<Array<ItemEntity>> {
    const offeredItem = await this.itemsRepository.findOne(id, {
      relations: [`to_where_offered`],
    });

    // Базовые проверки на существование, принадлежность, возможность выложить

    if (!offeredItem)
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_ITEM);

    const isUserItem = offeredItem.user_id !== user.id;

    if (offeredItem.to_where_offered)
      throw new BadRequestException(ErrorMessagesEnum.ITEM_ALREADY_OFFERED);

    // Поиск вещей с подходящими категориями

    return await this.itemsRepository.find({
      where: {
        user_id: Not(user.id),
        item_category_id: offeredItem.trade_category_id,
        trade_category_id: offeredItem.item_category_id,
      },
      relations: [`photos`, `user`, `item_category`, `trade_category`],
    });
  }

  async cancelTradeoffer(user: User, id: number): Promise<boolean> {
    const tradeoffer = await this.tradeoffersRepository.findOne(id, {
      relations: [`offered_item`, `desired_item`],
    });

    if (!tradeoffer)
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_TRADEOFFER);

    if (
      tradeoffer.offered_item.user_id !== user.id &&
      tradeoffer.desired_item.user_id !== user.id
    )
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_TRADEOFFER);

    await this.tradeoffersRepository.remove(tradeoffer);

    return true;
  }

  async acceptTradeoffer(user: User, id: number): Promise<boolean> {
    const tradeoffer = await this.tradeoffersRepository.findOne(id, {
      relations: [`offered_item`, `desired_item`],
    });

    if (!tradeoffer)
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_TRADEOFFER);

    if (tradeoffer.desired_item.user_id !== user.id)
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_TRADEOFFER);

    await this.itemsRepository.remove(tradeoffer.desired_item);
    await this.itemsRepository.remove(tradeoffer.offered_item);

    return true;
  }
}
