import { Module } from '@nestjs/common';
import { UsersService } from '#src/modules/user/users.service';
import { UsersController } from '#src/modules/user/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { Profile } from '#src/modules/user/entity/profile.entity';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, PhotoEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
