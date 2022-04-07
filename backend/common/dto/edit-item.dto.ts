import { IsNotEmpty, IsOptional } from 'class-validator';

export class EditItemDto {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  geo: string;

  @IsOptional()
  item_category_id: number;

  @IsOptional()
  trade_category_id: number;
}
