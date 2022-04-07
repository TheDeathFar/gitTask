import React, { FC } from 'react';
import { ItemDto } from '#server/common/dto/item.dto';
import { srcFromPhotoPath } from '#src/js/util/src-from-photo-path';
import noPhoto from '#src/icons/no-photo.svg';

interface Props {
  item: ItemDto;
  width?: `small` | `medium` | `large` | `xlarge` | `1-1`;
  padding?: boolean;
}

export const PhotosSlideshow: FC<Props> = ({ item, width = `xlarge`, padding = true }) => {
  const isNoPhoto = !(item?.photos && item.photos.length !== 0);

  return (
    <div className={`ItemPhotos ${(padding) ? `ItemPhotos--padding@m` : ``} uk-width-${width} uk-position-relative uk-margin-bottom`} uk-slideshow={``}>
      <ul className={`uk-slideshow-items`}>
        {(isNoPhoto) ? (
          <li><img src={noPhoto} alt={``} uk-cover={``} /></li>
        ) : (
          item.photos?.map(({ photoPath }) => (
            <li key={photoPath}><img src={srcFromPhotoPath(photoPath)} alt={``} uk-cover={``} /></li>
          ))
        )}
        {}
      </ul>
      <button
        className={`uk-position-center-left uk-position-small uk-hidden-hover uk-link`}
        uk-slidenav-previous={``}
        uk-slideshow-item={`previous`}
      />
      <button
        className={`uk-position-center-right uk-position-small uk-hidden-hover uk-link`}
        uk-slidenav-next={``}
        uk-slideshow-item={`next`}
      />
    </div>
  );
};