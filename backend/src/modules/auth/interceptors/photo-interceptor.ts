import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MAX_ITEM_PHOTOS } from '#server/common/constants/constants';
import { isPhotoFilename } from '#server/common/util/is-photo-filename';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { UPLOAD_PATH } from '#src/constants/backend-constants';

export const PhotoInterceptor = (name = `photo`) =>
  FileInterceptor(name, {
    storage: diskStorage({
      destination: UPLOAD_PATH,
      filename(req, file, callback) {
        callback(
          null,
          `${uuidv4()}${extname(file.originalname.toLowerCase())}`,
        );
      },
    }),
    fileFilter(req, file, callback) {
      const isImage =
        [`image/jpeg`, `image/png`].includes(file.mimetype) &&
        isPhotoFilename(file.originalname);
      if (isImage) {
        callback(null, true);
        return;
      }

      callback(
        new BadRequestException(ErrorMessagesEnum.WRONG_PHOTO_TYPE),
        false,
      );
    },
  });

export const PhotosInterceptor = (name = `photos`) =>
  FilesInterceptor(name, MAX_ITEM_PHOTOS, {
    storage: diskStorage({
      destination: UPLOAD_PATH,
      filename(req, file, callback) {
        callback(
          null,
          `${uuidv4()}${extname(file.originalname.toLowerCase())}`,
        );
      },
    }),
    fileFilter(req, file, callback) {
      const isImage =
        [`image/jpeg`, `image/png`].includes(file.mimetype) &&
        isPhotoFilename(file.originalname);
      if (isImage) {
        callback(null, true);
        return;
      }

      callback(
        new BadRequestException(ErrorMessagesEnum.WRONG_PHOTO_TYPE),
        false,
      );
    },
  });
