import { CreateItemDto } from '#server/common/dto/create-item.dto';

export interface AddItemFormDto extends CreateItemDto {
  photos: FileList
}