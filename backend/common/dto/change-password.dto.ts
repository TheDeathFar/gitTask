import { IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '#server/common/validators/validator-extend-match-decorator';

export class ChangePasswordDto {
  @MinLength(8, { message: `Нужно ввести >= $constraint1 символов` })
  @IsNotEmpty({ message: `Нужно указать пароль` })
  oldPassword: string;

  @MinLength(8, { message: `Нужно ввести >= $constraint1 символов` })
  @IsNotEmpty({ message: `Нужно указать пароль` })
  newPassword: string;

  @Match(ChangePasswordDto, (s) => s.newPassword, {
    message: `Пароли не совпадают`,
  })
  newPasswordConfirmation: string;
}
