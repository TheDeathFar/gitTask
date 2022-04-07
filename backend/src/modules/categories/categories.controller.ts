import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { CategoriesService } from '#src/modules/categories/categories.service';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import { CreateCategoryDto } from '#server/common/dto/create-category.dto';

@Controller(`categories`)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategories(): Promise<Array<CategoryEntity>> {
    return await this.categoriesService.getCategories();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async addCategory(
    @Request() req,
    @Body() body: CreateCategoryDto,
  ): Promise<Array<CategoryEntity>> {
    return await this.categoriesService.createCategory(body.name);
  }

  @Delete(`/:id`)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteItem(
    @Param(`id`, ParseIntPipe) id: number,
  ): Promise<Array<CategoryEntity>> {
    return await this.categoriesService.removeCategory(id);
  }
}
