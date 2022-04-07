import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '#src/modules/user/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtDto } from '#server/common/dto/jwt.dto';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import * as fs from 'fs';
import { User } from '#src/modules/user/entity/user.entity';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    // Найдем пользователя по переданным данным и проверим пароль

    const user = await this.usersService.findOneByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User): JwtDto {
    return user.toJwtDto(this.jwtService);
  }

  async register(createUserDto: CreateUserDto): Promise<JwtDto> {
    try {
      const { username, email } = createUserDto;

      if (await this.usersService.findOneByUsername(username))
        throw new ConflictException(ErrorMessagesEnum.USERNAME_CONFLICT);

      if (await this.usersService.findOneByEmail(email))
        throw new ConflictException(ErrorMessagesEnum.EMAIL_CONFLICT);

      const newUser = await this.usersService.createUser(createUserDto);
      return newUser.toJwtDto(this.jwtService);
    } catch (e) {
      if (createUserDto.photoPath) {
        // Удаляем загруженную фотографию, если произошла ошибка
        await fs.unlink(createUserDto.photoPath, () => {});
      }
      throw e;
    }
  }
}
