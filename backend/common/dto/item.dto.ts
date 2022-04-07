import { CategoryDto } from '#server/common/dto/category.dto';

export class ItemDto {
  id: number;
  name: string;
  description: string;
  geo: string;
  photos: Array<{ photoPath: string }>;
  item_category: CategoryDto;
  trade_category: CategoryDto;
  user: string;
  to_where_offered: number;
}
