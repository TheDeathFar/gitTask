import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '#server/common/dto/user.dto';
import { UsersService } from '#src/modules/user/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env[`JWT_SECRET_TOKEN`],
    });
  }

  async validate(payload: UserDto) {
    return await this.usersService.findOneByUsername(payload.username);
  }
}
