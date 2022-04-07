import React, { FC, useState } from 'react';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import InputHint from '#components/input-hint/input-hint';
import { isPhotoFilename } from '#server/common/util/is-photo-filename';
import { MAX_ITEM_PHOTOS } from '#server/common/constants/constants';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { ItemPhotosUl } from '#domains/items/components/item-photos-ul/item-photos-ul';

interface Props {
  photos: FileList,
  setPhotos: (photos: FileList) => void
}

export const MainPhotoInput: FC<Props> = ({ photos, setPhotos }) => {
  const [errors, setErrors] = useState<string>(null);

  return (
    <>
      <div className={`uk-inline uk-width-expand uk-margin-small uk-margin-remove-top`}>
        <div className='uk-flex uk-form-label'>
          <span>{keyToLabelText.get(`photosPaths`)}</span>
        </div>
        <div className={`uk-position-relative`}>
          <div className={`uk-flex`} uk-form-custom={`target: true`}>
            <input accept={`.png,.jpg`} type={`file`} multiple={true} onChange={(e) => {
              if (e.target?.files) {
                if (e.target.files.length === 0) {
                  setPhotos(null);
                } else {
                  if (Array.from(e.target.files).find((file) => !isPhotoFilename(file.name))) {
                    setErrors(ErrorMessagesEnum.WRONG_PHOTO_TYPE);
                    setPhotos(null);
                    return;
                  }

                  if (e.target.files.length > MAX_ITEM_PHOTOS) {
                    setErrors(ErrorMessagesEnum.PHOTO_LIMIT);
                    setPhotos(null);
                    return;
                  }

                  setPhotos(e.target.files);
                  setErrors(null);
                }

              }
            }} />
            <input
              type={`text`}
              className={`uk-width-expand uk-input uk-margin-small-right`}
              placeholder={`Выбрать файл`}
              disabled={true}
            />
            <InputHint
              text={errors}
              className={`uk-position-center-right-out`}
              isActive={!!errors}
            />
            <button type={`button`} className={`uk-button uk-button-default`}>Загрузить</button>
          </div>
        </div>
        <ItemPhotosUl photos={photos}/>
      </div>

    </>
  );
};