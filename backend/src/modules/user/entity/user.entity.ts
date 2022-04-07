import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from '#src/modules/user/entity/profile.entity';
import {
  classToPlain,
  Exclude,
  Expose,
  plainToClass,
  Type,
} from 'class-transformer';
import { UserDto } from '#server/common/dto/user.dto';
import { validateSync } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import * as chalk from 'chalk';
import { JwtDto } from '#server/common/dto/jwt.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '#server/common/enums/user-role.enum';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Expose({ name: `username` })
  @Column({ unique: true })
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: `enum`,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  toDto(): UserDto {
    // Transform
    const plainThis = classToPlain(this);
    const plainUserDto = {
      ...plainThis,
      ...plainThis.profile,
      ...plainThis.profile.photo,
    };
    delete plainUserDto.profile;
    delete plainUserDto.photo;

    // Validate
    const userDto = plainToClass(UserDto, plainUserDto);
    const errors = validateSync(userDto, {});

    if (errors.length) {
      console.error(chalk.red(errors.toString()));
      throw new InternalServerErrorException();
    }

    return plainUserDto;
  }

  toJwtDto(jwtService: JwtService) {
    // Transform
    const plainUserDto = this.toDto();
    const plainJwtDto: JwtDto = {
      access_token: jwtService.sign(plainUserDto),
    };

    // Validate
    const jwtDto = plainToClass(JwtDto, plainJwtDto);
    const errors = validateSync(jwtDto, {});

    if (errors.length) {
      console.error(chalk.red(errors.toString()));
      throw new InternalServerErrorException();
    }

    return plainJwtDto;
  }

  // Relations
  @Type(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @Type(() => ItemEntity)
  @OneToMany(() => ItemEntity, (item) => item.user)
  items: ItemEntity[];
}
