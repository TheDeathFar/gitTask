import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty({ message: `Нужно указать название` })
  name: string;

  @IsNotEmpty({ message: `Нужно указать описание` })
  description: string;

  @IsNotEmpty({ message: `Нужно указать местоположение` })
  geo: string;

  @IsNotEmpty({ message: `Нужно указать категорию вещи` })
  item_category_id: number;

  @IsNotEmpty({ message: `Нужно указать категорию для обмена` })
  trade_category_id: number;

  @IsOptional()
  photosPaths?: Array<string>;
}
