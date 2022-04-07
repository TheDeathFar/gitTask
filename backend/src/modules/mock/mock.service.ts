import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { Profile } from '#src/modules/user/entity/profile.entity';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import {
  MOCK_USER_MAX_ITEMS,
  MOCK_USERS_COUNT,
  UPLOAD_PATH,
} from '#src/constants/backend-constants';
import * as crypto from 'crypto';
import { generateFromString } from 'generate-avatar';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { PAGE_SIZE } from '#server/common/constants/constants';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';
import { UserRole } from '#server/common/enums/user-role.enum';

const svg2img = require(`svg2img`);

const genImage = async (): Promise<string> => {
  const filepath = path.join(UPLOAD_PATH, `${uuidv4()}.png`);
  const svgImage = generateFromString(crypto.randomBytes(10).toString(`hex`));
  await new Promise<void>((resolve, reject) => {
    svg2img(svgImage, (err, buffer) => {
      if (err) reject(err);

      fs.writeFileSync(filepath, buffer);

      resolve();
    });
  });

  return filepath;
};

const getRandom = (n: number): string => crypto.randomBytes(n).toString(`hex`);

@Injectable()
export class MockService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(ItemEntity)
    private itemsRepository: Repository<ItemEntity>,
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(PhotoEntity)
    private photosRepository: Repository<PhotoEntity>,
    @InjectRepository(TradeOfferEntity)
    private tradeoffersRepository: Repository<TradeOfferEntity>,
  ) {}

  async generate() {
    const testUser = await this.userRepository.findOne({
      where: { login: `test_user` },
    });

    if (testUser) throw new BadRequestException(`Уже сгенерировано`);

    const testUserProfile = this.profileRepository.create({
      firstName: `Test User`,
      phone: `9081111111`,
      email: `test_user@gmail.com`,
      birthday: `1990-11-11`,
    });

    const testUserNew = this.userRepository.create({
      login: `test_user`,
      password: `test_user`,
      profile: testUserProfile,
    });

    // Сгенерируем пользователей

    const randomUsers = [];
    for (let i = 0; i < MOCK_USERS_COUNT; i++) {
      const name1 = getRandom(4);
      const name2 = getRandom(4);
      const login = `${name1}_${name2}`;

      const randomProfile = this.profileRepository.create({
        firstName: `${name1} ${name2}`,
        phone: `9089999999`,
        email: `${login}@gmail.com`,
        birthday: `1999-01-01`,
      });

      const randomUser = this.userRepository.create({
        login,
        password: login,
        profile: randomProfile,
      });

      randomUsers.push(randomUser);
    }

    randomUsers.push(testUserNew);

    await this.userRepository.save(randomUsers);

    // Создадим каждому несколько вещей

    await this.generateItems();

    // А для вещей создадим трейдофферы

    await this.generateTradeoffers();
  }

  async generateItems() {
    const categories = await this.categoriesRepository.find();
    const users = await this.userRepository.find({ role: UserRole.USER });
    const newItems: ItemEntity[] = [];
    for (const user of users) {
      const minItems = user.login === `test_user` ? PAGE_SIZE + 1 : 1;
      for (
        let i = 0;
        i < ~~(Math.random() * MOCK_USER_MAX_ITEMS) + minItems;
        i++
      ) {
        const photos: PhotoEntity[] = [];
        for (let j = 0; j < ~~(Math.random() * 3) + 1; j++) {
          photos.push(
            this.photosRepository.create({
              photo_path: await genImage(),
            }),
          );
        }

        const newItem = this.itemsRepository.create({
          name: crypto.randomBytes(5).toString(`hex`),
          description: `${getRandom(10)}. ${getRandom(5)}, ${getRandom(5)}.`,
          geo: getRandom(6),
          item_category: categories[~~(Math.random() * categories.length)],
          trade_category: categories[~~(Math.random() * categories.length)],
          user,
          photos,
        });
        newItems.push(newItem);
      }
    }

    await this.itemsRepository.save(newItems);
  }

  async generateTradeoffers() {
    const items = await this.itemsRepository.find();
    const existedTradeoffers: TradeOfferEntity[] =
      await this.tradeoffersRepository.find();

    for (const item1 of items) {
      for (const item2 of items) {
        if (
          item2.trade_category_id === item1.item_category_id &&
          item2.item_category_id === item1.trade_category_id
        ) {
          if (
            // xD
            Math.random() > Math.log10(2 * Math.PI) &&
            !existedTradeoffers.find(
              (to) =>
                to.offered_item_id === item1.id ||
                to.desired_item_id === item2.id ||
                to.desired_item_id === item1.id,
            )
          ) {
            existedTradeoffers.push(
              this.tradeoffersRepository.create({
                offered_item: item1,
                desired_item: item2,
              }),
            );
          }
        }
      }
    }

    await this.tradeoffersRepository.save(existedTradeoffers);
  }
}
