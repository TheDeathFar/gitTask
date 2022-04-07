import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { Exclude, Transform, Type } from 'class-transformer';
import * as moment from 'moment';
import { PhotoEntity } from '#src/modules/photos/entity/photo.entity';

@Entity()
export class Profile {
  @Exclude()
  @PrimaryColumn()
  user_id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: `first_name` })
  firstName: string;

  @Column({ length: 10 })
  phone: string;

  @Type(() => String)
  @Transform(({ value }) =>
    value ? moment(value).format(`YYYY-MM-DD`) : undefined,
  )
  @Column({ type: `date` })
  birthday: Date;

  @Exclude()
  @Column({ nullable: true })
  photo_id: number;

  // Relations
  @Exclude()
  @OneToOne(() => User, { primary: true, onDelete: `CASCADE` })
  @JoinColumn({ name: `user_id` })
  user: User;

  @Type(() => PhotoEntity)
  @ManyToOne(() => PhotoEntity, (photo) => photo.profiles, {
    cascade: true,
    onDelete: `SET NULL`,
  })
  @JoinColumn({ name: `photo_id` })
  photo: PhotoEntity;
}
