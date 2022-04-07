import React, { FC } from 'react';
import noPhoto from '#src/icons/no-photo.svg';
import { UserDto } from '#server/common/dto/user.dto';
import { srcFromPhotoPath } from '#src/js/util/src-from-photo-path';

interface Props {
  className?: string;
  user: UserDto;
}

export const AnyUserPhoto: FC<Props> = ({ className, user }) => {
  const userPhotoUrl = (user.photoPath) ? srcFromPhotoPath(user.photoPath) : null;

  return (
    <div className={`PhotoContainer ${className}`} style={{
      backgroundImage: `url(${userPhotoUrl ?? noPhoto})`,
    }} />
  );
};