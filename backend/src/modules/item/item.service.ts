import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { Repository } from 'typeorm';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { User } from '#src/modules/user/entity/user.entity';
import { CreateItemDto } from '#server/common/dto/create-item.dto';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { EditItemDto } from '#server/common/dto/edit-item.dto';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>,
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getItem(user: User, id: number): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne(id, {
      relations: [
        `photos`,
        `user`,
        `item_category`,
        `trade_category`,
        `to_where_offered`,
      ],
    });

    if (user.id !== item.user_id) {
      item.to_where_offered = null;
    }

    if (!item) throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_ITEM);

    return item;
  }

  async createItem(user: User, body: CreateItemDto): Promise<ItemEntity> {
    const { item_category_id, trade_category_id } = body;

    if (
      !(await this.categoryRepository.findOne(item_category_id)) ||
      !(await this.categoryRepository.findOne(trade_category_id))
    )
      throw new BadRequestException(ErrorMessagesEnum.NO_SUCH_CATEGORY);

    const photos: PhotoEntity[] =
      body.photosPaths?.map((photo_path) =>
        this.photoRepository.create({
          photo_path,
        }),
      ) ?? [];

    const newItem = this.itemRepository.create({
      ...body,
      user,
      photos,
    });

    await this.itemRepository.save(newItem);

    return await this.getItem(user, newItem.id);
  }

  async removeItem(user: User, id: number): Promise<boolean> {
    const targetItem = await this.itemRepository.findOne(id, {
      relations: [`user`],
    });

    if (!targetItem) {
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_ITEM);
    }

    if (user.id !== targetItem.user.id) {
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_ITEM);
    }

    await this.itemRepository.delete(id);

    return true;
  }

  async editItem(
    user: User,
    id: number,
    plainEditItemDto: EditItemDto,
  ): Promise<ItemEntity> {
    const { name, geo, description, item_category_id, trade_category_id } =
      plainEditItemDto;

    const item = await this.itemRepository.findOne(id, { relations: [`user`] });

    if (!item) throw new BadRequestException(ErrorMessagesEnum.NO_SUCH_ITEM);

    if (item.user.id !== user.id)
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_ITEM);

    if (name) item.name = name;
    if (description) item.description = description;
    if (geo) item.geo = geo;

    if (item_category_id) {
      if (await this.categoryRepository.findOne(item_category_id))
        item.item_category_id = item_category_id;
      else throw new BadRequestException(ErrorMessagesEnum.NO_SUCH_CATEGORY);
    }

    if (trade_category_id) {
      if (await this.categoryRepository.findOne(trade_category_id))
        item.trade_category_id = trade_category_id;
      else throw new BadRequestException(ErrorMessagesEnum.NO_SUCH_CATEGORY);
    }

    await this.itemRepository.save(item);

    return await this.getItem(user, item.id);
  }

  async setItemPhotos(
    user: User,
    photos: Array<Express.Multer.File>,
    id: number,
  ): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne(id, {
      relations: [`photos`, `user`],
    });

    if (!item) throw new BadRequestException(ErrorMessagesEnum.NO_SUCH_ITEM);

    if (item.user.id !== user.id)
      throw new UnauthorizedException(ErrorMessagesEnum.NOT_YOUR_ITEM);

    await this.photoRepository.remove(item.photos);

    const photoEntities: PhotoEntity[] = photos.map((photo) =>
      this.photoRepository.create({
        photo_path: photo.path,
      }),
    );

    item.photos = photoEntities;

    await this.itemRepository.save(item);

    return await this.getItem(user, id);
  }
}
