import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '#src/modules/user/entity/profile.entity';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { EditProfileDto } from '#server/common/dto/edit-profile.dto';
import { JwtDto } from '#server/common/dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '#server/common/dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(PhotoEntity)
    private photoRepository: Repository<PhotoEntity>,
    private jwtService: JwtService,
  ) {}

  findOneByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { login: username },
      relations: [`profile`, `profile.photo`],
    });
  }

  findOneByEmail(email: string): Promise<Profile | undefined> {
    return this.profileRepository.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;
    const { email, phone, firstName, photoPath, birthday } = createUserDto;

    let photo;
    if (photoPath) {
      photo = this.photoRepository.create({
        photo_path: photoPath,
      });
      await this.photoRepository.save(photo);
    }

    const userProfile = this.profileRepository.create({
      email,
      phone,
      firstName,
      birthday,
      photo,
    });

    const userEntity = this.userRepository.create({
      login: username,
      password,
      profile: userProfile,
    });

    await this.userRepository.save(userEntity);

    return userEntity;
  }

  async editProfile(
    user: User,
    plainEditProfileDto: EditProfileDto,
  ): Promise<JwtDto> {
    const { email, phone, firstName, birthday } = plainEditProfileDto;

    if (user.profile.email !== email)
      if (await this.findOneByEmail(email))
        throw new ConflictException(ErrorMessagesEnum.EMAIL_CONFLICT);

    if (firstName) user.profile.firstName = firstName;
    if (email) user.profile.email = email;
    if (phone) user.profile.phone = phone;
    if (birthday) user.profile.birthday = birthday as any;

    await this.profileRepository.save(user.profile);

    return user.toJwtDto(this.jwtService);
  }

  async setPhoto(user: User, photoPath: string): Promise<JwtDto> {
    const newPhoto = await this.photoRepository.create({
      photo_path: photoPath,
    });
    await this.photoRepository.save(newPhoto);

    user.profile.photo = newPhoto;

    await this.userRepository.save(user);

    return user.toJwtDto(this.jwtService);
  }

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<JwtDto> {
    if (!(await bcrypt.compare(changePasswordDto.oldPassword, user.password)))
      throw new BadRequestException(ErrorMessagesEnum.WRONG_OLD_PASSWORD);

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);

    await this.userRepository.save(user);

    return user.toJwtDto(this.jwtService);
  }
}
