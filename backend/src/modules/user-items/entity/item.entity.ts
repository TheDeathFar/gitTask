import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import {
  classToPlain,
  Exclude,
  plainToClass,
  Transform,
  Type,
} from 'class-transformer';
import { User } from '#src/modules/user/entity/user.entity';
import { validateSync } from 'class-validator';
import * as chalk from 'chalk';
import { InternalServerErrorException } from '@nestjs/common';
import { ItemDto } from '#server/common/dto/item.dto';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';

@Entity({ name: `item` })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: `text` })
  description: string;

  @Column()
  geo: string;

  @Exclude()
  @Column()
  item_category_id: number;

  @Exclude()
  @Column()
  trade_category_id: number;

  @Exclude()
  @Column()
  user_id: number;

  toDto(): ItemDto {
    // Transform
    const plainThis = classToPlain(this);

    // Validate
    const itemDto = plainToClass(ItemDto, plainThis);
    const errors = validateSync(itemDto, {});

    if (errors.length) {
      console.error(chalk.red(errors.toString()));
      throw new InternalServerErrorException();
    }

    return plainThis as ItemDto;
  }

  // Relations
  @Type(() => PhotoEntity)
  @ManyToMany(() => PhotoEntity, (photo) => photo.items, { cascade: true })
  @JoinTable({
    name: `items_to_photos`,
    joinColumn: { name: `item_id` },
    inverseJoinColumn: { name: `photo_id` },
  })
  photos: PhotoEntity[];

  @Type(() => CategoryEntity)
  @ManyToOne(
    () => CategoryEntity,
    (category) => category.items_with_item_category,
    { cascade: true, onDelete: `CASCADE` },
  )
  @JoinColumn({ name: `item_category_id` })
  item_category: CategoryEntity;

  @Type(() => CategoryEntity)
  @ManyToOne(
    () => CategoryEntity,
    (category) => category.items_with_trade_category,
    { cascade: true, onDelete: `CASCADE` },
  )
  @JoinColumn({ name: `trade_category_id` })
  trade_category: CategoryEntity;

  @Type(() => User)
  @Transform(({ value }) => value.login)
  @ManyToOne(() => User, (user) => user.items, {
    cascade: true,
    onDelete: `CASCADE`,
  })
  @JoinColumn({ name: `user_id` })
  user: User;

  @Type(() => TradeOfferEntity)
  @Transform(({ value }) => value?.id ?? null)
  @OneToOne(() => TradeOfferEntity, (to) => to.offered_item, {
    cascade: true,
  })
  to_where_offered: TradeOfferEntity;

  @OneToMany(() => TradeOfferEntity, (to) => to.desired_item)
  tos_where_desired: TradeOfferEntity[];
}
