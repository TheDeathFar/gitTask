import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from '#src/modules/user/users.service';
import { Public } from '#src/modules/auth/decorators/public.decorator';
import { EditProfileDto } from '#server/common/dto/edit-profile.dto';
import { JwtDto } from '#server/common/dto/jwt.dto';
import { PhotoInterceptor } from '#src/modules/auth/interceptors/photo-interceptor';
import { ChangePasswordDto } from '#server/common/dto/change-password.dto';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { RolesGuard } from '#src/modules/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller(`user`)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put(`edit_profile`)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async editProfile(
    @Request() req,
    @Body() body: EditProfileDto,
  ): Promise<JwtDto> {
    return await this.usersService.editProfile(req.user, body);
  }

  @Put(`set_photo`)
  @Roles(UserRole.USER, UserRole.ADMIN)
  @UseInterceptors(PhotoInterceptor(`photo`))
  async setPhoto(
    @Request() req,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<JwtDto> {
    if (!photo)
      throw new BadRequestException(ErrorMessagesEnum.PHOTO_IS_REQUIRED);

    return await this.usersService.setPhoto(req.user, photo.path);
  }

  @Put(`change_password`)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async changePassword(
    @Request() req,
    @Body() body: ChangePasswordDto,
  ): Promise<JwtDto> {
    return await this.usersService.changePassword(req.user, body);
  }

  @Public()
  @Get(`is_user_already_exist/:username`)
  async isUsernameExist(@Param(`username`) username: string): Promise<boolean> {
    return !!(await this.usersService.findOneByUsername(username));
  }

  @Public()
  @Get(`is_email_already_exist/:email`)
  async isEmailExist(@Param(`email`) email: string): Promise<boolean> {
    return !!(await this.usersService.findOneByEmail(email));
  }
}
