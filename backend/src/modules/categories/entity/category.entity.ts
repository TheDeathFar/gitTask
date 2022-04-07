import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';

@Entity({ name: `category` })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  // Relations
  @OneToMany(() => ItemEntity, (item) => item.item_category)
  items_with_item_category: ItemEntity[];

  @OneToMany(() => ItemEntity, (item) => item.trade_category)
  items_with_trade_category: ItemEntity[];
}
