import { Module } from '@nestjs/common';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity])],
  controllers: [CatalogueController],
  providers: [CatalogueService],
})
export class CatalogueModule {}
