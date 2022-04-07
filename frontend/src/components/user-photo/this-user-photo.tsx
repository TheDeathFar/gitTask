import React, { FC } from 'react';
import noPhoto from '#src/icons/no-photo.svg';
import { useSelector } from 'react-redux';
import { userPhotoUrlSelector } from '#redux/selectors';

interface Props {
  className?: string;
}

export const ThisUserPhoto: FC<Props> = ({className = ``}) => {
  const userPhotoUrl = useSelector(userPhotoUrlSelector);

  return (
    <div className={`PhotoContainer ${className}`} style={{
      backgroundImage: `url(${userPhotoUrl ?? noPhoto})`,
    }} />
  );
};