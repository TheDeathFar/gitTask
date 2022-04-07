import {
  IsDateString,
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { MaxDateString } from '#server/common/validators/validator-extend-max-date-string-decorator';
import { get18yoDate } from '#server/common/dto/create-user.dto';
import { PHONE_REGEX } from '#server/common/constants/constants';

export class EditProfileDto {
  @IsOptional()
  firstName: string;

  @IsEmail(undefined, { message: `Некорректный email` })
  @IsOptional()
  email: string;

  @IsMobilePhone(`ru-RU`, { strictMode: false }, { message: `Неверный формат` })
  @Matches(PHONE_REGEX, { message: `Введите 10 символов без кода страны` })
  @IsOptional()
  phone: string;

  @MaxDateString(new Date(), { message: `Введите корректную дату рождения` })
  @MaxDateString(get18yoDate(), { message: `Вам должно быть 18 лет` })
  @IsDateString({ strict: false }, { message: `Неверный формат даты` })
  @IsOptional()
  birthday: string;
}
