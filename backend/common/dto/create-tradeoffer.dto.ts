import { IsNotEmpty } from 'class-validator';

export class CreateTradeofferDto {
  @IsNotEmpty()
  offered_item_id: number;

  @IsNotEmpty()
  desired_item_id: number;
}
