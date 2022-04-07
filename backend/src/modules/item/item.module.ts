import { Module } from '@nestjs/common';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, CategoryEntity, PhotoEntity]),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
