import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { Match } from '#server/common/validators/validator-extend-match-decorator';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsUsernameAvailable } from '#src/js/validators/validator-extend-is-username-available';
import { IsEmailAvailable } from '#src/js/validators/validator-extend-is-email-available';

export class FirstStepData extends CreateUserDto {
  @Match(FirstStepData, (s) => s.password, { message: `Пароли не совпадают` })
  passwordConfirmation: string;

  @IsUsernameAvailable({ message: `Это имя уже занято` })
  @IsNotEmpty({ message: `Нужно указать логин` })
  username: string;

  @IsEmailAvailable({message: `Эта почта уже занята`})
  @IsEmail(undefined, { message: `Некорректный email` })
  email: string;

  @IsOptional()
  firstName;
  @IsOptional()
  phone;
  @IsOptional()
  birthday;
  @IsOptional()
  photoPath;

}