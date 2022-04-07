import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from '#server/common/enums/user-role.enum';

export class UserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  role: UserRole;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  birthday: string;

  photoPath?: string;
}
