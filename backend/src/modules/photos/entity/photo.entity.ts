import {
  BeforeRemove,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Profile } from '#src/modules/user/entity/profile.entity';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import * as fs from 'fs';

@Entity({ name: `photo` })
export class PhotoEntity {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Transform(
    ({ value }: { value: string }) => value?.replace(/\\/, `/`) ?? null,
  )
  @Expose({ name: `photoPath` })
  @Column({ type: `text` })
  photo_path: string;

  @BeforeRemove()
  async removeFromUploads() {
    try {
      await fs.unlink(this.photo_path, () => {});
    } catch (e) {
      console.error(e);
    }
  }

  // Relations
  @OneToMany(() => Profile, (profile) => profile.photo, { onDelete: `CASCADE` })
  profiles: Profile[];

  @ManyToMany(() => ItemEntity, (item) => item.photos, { onDelete: `CASCADE` })
  items: ItemEntity[];
}
