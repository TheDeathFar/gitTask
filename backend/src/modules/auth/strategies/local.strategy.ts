import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '#src/modules/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '#src/modules/user/entity/user.entity';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException(ErrorMessagesEnum.WRONG_CREDENTIALS);
    }
    return user;
  }
}
