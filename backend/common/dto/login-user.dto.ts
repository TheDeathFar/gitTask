import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({ message: `Нужно указать логин` })
  username: string;

  @MinLength(8, { message: `Нужно ввести >= $constraint1 символов` })
  @IsNotEmpty({ message: `Нужно указать пароль` })
  password: string;
}
