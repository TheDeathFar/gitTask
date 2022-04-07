import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from '#src/modules/auth/auth.service';
import { Public } from '#src/modules/auth/decorators/public.decorator';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { JwtDto } from '#server/common/dto/jwt.dto';
import { PhotoInterceptor } from '#src/modules/auth/interceptors/photo-interceptor';

@Controller(`auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post(`login`)
  async login(@Request() req): Promise<JwtDto> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post(`register`)
  @UseInterceptors(PhotoInterceptor(`photo`))
  async register(
    @UploadedFile() photo: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<JwtDto> {
    return this.authService.register({
      ...createUserDto,
      photoPath: photo?.path,
    });
  }
}
