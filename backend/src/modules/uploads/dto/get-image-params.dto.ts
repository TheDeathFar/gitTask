import { IsPhotoPath } from '#server/common/validators/validator-extend-is-photo-path';
import { Matches } from 'class-validator';

export class GetImageParamsDto {
  @Matches(
    /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b\.[a-z]+$/,
    { message: `Даже не пытайся :)` },
  )
  @IsPhotoPath({ message: `Получить можно только картинку` })
  image: string;
}
