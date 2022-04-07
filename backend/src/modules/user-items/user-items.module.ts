import { Module } from '@nestjs/common';
import { UserItemsService } from './user-items.service';
import { UserItemsController } from './user-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, PhotoEntity, CategoryEntity]),
  ],
  providers: [UserItemsService],
  controllers: [UserItemsController],
})
export class UserItemsModule {}
