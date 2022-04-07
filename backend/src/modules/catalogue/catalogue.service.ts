import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Raw, Repository } from 'typeorm';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { PAGE_SIZE } from '#server/common/constants/constants';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CatalogueDto } from '#server/common/dto/catalogue.dto';
import { ItemDto } from '#server/common/dto/item.dto';
import { User } from '#src/modules/user/entity/user.entity';
import { appPaginate } from '#src/util/app-paginate';

@Injectable()
export class CatalogueService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async getItemsList(
    user: User,
    props: PaginationRequestDto,
  ): Promise<CatalogueDto> {
    const {
      page = 1,
      order = `id`,
      orderDirection = `ASC`,
      query = ``,
    } = props;

    // Нужно получить множественную связь с фотографиями, поэтому не можем использовать твикер
    const paginatedItems = await paginate<ItemEntity>(
      this.itemRepository,
      {
        page,
        limit: PAGE_SIZE,
      },
      {
        where: {
          name: Like(`%${query}%`),
        },
        relations: [
          `photos`,
          `item_category`,
          `trade_category`,
          `user`,
          `to_where_offered`,
        ],
        order: {
          [order]: orderDirection.toUpperCase(),
        },
      },
    );

    // Не будем показывать пользователю А, на какую вещь
    // оформлен трейдоффер у пользователя Б
    for (const item of paginatedItems.items) {
      if (item.user_id !== user.id) item.to_where_offered = null;
    }

    return new Pagination<ItemDto>(
      paginatedItems.items.map((item) => item.toDto()),
      paginatedItems.meta,
    );
  }

  async getRecommendationsList(
    user: User,
    props: PaginationRequestDto,
  ): Promise<CatalogueDto> {
    const { query = `` } = props;

    const userItems = await this.itemRepository.find({ user });

    /*
     * Через репозиторий такой сложный запрос не напишешь, он не умеет в скобки.
     * Через QB, если использовать джоины, то ломается пагинатор из-за связи
     * многие-ко-многим Фотографии-Вещи. Он считает количество сджойненных полей,
     * а надо количество вещей. Получу сначала вещи без лишних связей, а затем все подгружу
     * */

    const paginatedItems = await appPaginate(
      this.itemRepository,
      props,
      {
        user_id: Raw(` != ${user.id}`),
        [Symbol(`AND (name like ...)`)]: [
          {
            sql: `$currentName.name LIKE :nameLike`,
            params: {
              nameLike: `%${query}%`,
            },
          },
        ],
        [Symbol(`AND (.. OR .. OR ..)`)]: userItems.map((item, index) => ({
          sql: `($currentName.item_category_id = :ici_${index}) AND ($currentName.trade_category_id = :tci_${index})`,
          params: {
            [`ici_${index}`]: item.trade_category_id,
            [`tci_${index}`]: item.item_category_id,
          },
        })),
        // Если у человека нет вещей, то нам нечего ему показать
        [Symbol(`AND false`)]:
          userItems.length === 0
            ? [
                {
                  sql: `1=2`,
                },
              ]
            : [],
      },
      {
        autoJoin: true,
        relations: [`item_category`, `trade_category`],
      },
    );

    // Подгрузим все связи

    const loadedItems = [];

    for (const item of paginatedItems.items) {
      loadedItems.push(
        await this.itemRepository.findOne(item.id, {
          relations: [`photos`, `user`, `item_category`, `trade_category`],
        }),
      );
    }

    /*
     * Сортировка по query уже произошла, а вот порядок сбросился.
     * Поэтому напишем еще раз order
     * */

    return new Pagination<ItemDto>(
      loadedItems.map((item) => item.toDto()),
      paginatedItems.meta,
    );
  }

  async deleteCatalogueItem(id: number): Promise<boolean> {
    const item = await this.itemRepository.findOne(id);

    if (!item) throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_ITEM);

    await this.itemRepository.remove(item);

    return true;
  }
}
