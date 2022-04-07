import { IsNotEmpty, IsOptional } from 'class-validator';

export class SetItemPhotosDto {
  @IsNotEmpty()
  id: number;
}
