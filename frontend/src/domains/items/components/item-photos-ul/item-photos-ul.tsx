import React, { FC } from 'react';

interface Props {
  photos: FileList;
}

export const ItemPhotosUl: FC<Props> = ({ photos }) => {
  return (
    <>
      {(photos?.length && photos.length !== 0) ? (
        <ul className={`uk-margin-left uk-margin-top`}>
          {Array.from(photos).map((photo) => (
            <li className={`uk-form-label`} key={photo.name}>
              {photo.name}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};