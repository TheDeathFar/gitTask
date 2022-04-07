import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { classToPlain, plainToClass, Type } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as chalk from 'chalk';
import { InternalServerErrorException } from '@nestjs/common';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';

@Entity({ name: `tradeoffer` })
export class TradeOfferEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  offered_item_id: number;

  @Column()
  desired_item_id: number;

  toDto() {
    // Transform
    const plainThis = classToPlain(this);

    // Validate
    const toDto = plainToClass(TradeofferDto, plainThis);
    const errors = validateSync(toDto, {});

    if (errors.length) {
      console.error(chalk.red(errors.toString()));
      throw new InternalServerErrorException();
    }

    return plainThis as TradeofferDto;
  }

  // Relations

  // Пусть пользователь для каждой своей вещи может сделать
  // только один трейдоффер. Это позволит избежать спама

  @Type(() => ItemEntity)
  @OneToOne(() => ItemEntity, (item) => item.to_where_offered, {
    onDelete: `CASCADE`,
  })
  @JoinColumn({ name: `offered_item_id` })
  offered_item: ItemEntity;

  @Type(() => ItemEntity)
  @ManyToOne(() => ItemEntity, (item) => item.tos_where_desired, {
    onDelete: `CASCADE`,
  })
  @JoinColumn({ name: `desired_item_id` })
  desired_item: ItemEntity;
}
