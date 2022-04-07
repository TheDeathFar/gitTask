import { Injectable } from '@nestjs/common';
import { User } from '#src/modules/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { Like, Repository } from 'typeorm';
import { ItemsListDto } from '#server/common/dto/items-list.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ItemDto } from '#server/common/dto/item.dto';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { PAGE_SIZE } from '#server/common/constants/constants';

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
  ) {}

  async getItemsList(
    user: User,
    props: PaginationRequestDto,
  ): Promise<ItemsListDto> {
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
          user,
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

    return new Pagination<ItemDto>(
      paginatedItems.items.map((item) => item.toDto()),
      paginatedItems.meta,
    );
  }
}
