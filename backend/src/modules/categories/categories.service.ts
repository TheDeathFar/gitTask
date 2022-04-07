import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from '#src/modules/categories/entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(): Promise<Array<CategoryEntity>> {
    return await this.categoryRepository.find({ order: { id: `ASC` } });
  }

  async createCategory(name: string): Promise<Array<CategoryEntity>> {
    const sameCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (sameCategory)
      throw new BadRequestException(ErrorMessagesEnum.CATEGORY_CONFLICT);

    const newCategory = this.categoryRepository.create({
      name,
    });

    await this.categoryRepository.save(newCategory);

    return await this.getCategories();
  }

  async removeCategory(id: number): Promise<Array<CategoryEntity>> {
    const targetCategory = await this.categoryRepository.findOne(id);

    if (!targetCategory) {
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_CATEGORY);
    }

    await this.categoryRepository.remove(targetCategory);

    return await this.getCategories();
  }
}
