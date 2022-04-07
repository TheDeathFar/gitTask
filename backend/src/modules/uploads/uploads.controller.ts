import {
  Controller,
  Get,
  NotFoundException,
  Param,
  StreamableFile,
} from '@nestjs/common';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import { GetImageParamsDto } from '#src/modules/uploads/dto/get-image-params.dto';
import { Public } from '#src/modules/auth/decorators/public.decorator';
import * as path from 'path';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { UPLOAD_PATH } from '#src/constants/backend-constants';

@Controller(`uploads`)
export class UploadsController {
  @Public()
  @Get(`:image`)
  async getImage(@Param() params: GetImageParamsDto): Promise<StreamableFile> {
    const filepath = path.join(UPLOAD_PATH, params.image);
    // Файл не существует
    if (!(await fs.promises.stat(filepath).catch(() => false)))
      throw new NotFoundException(ErrorMessagesEnum.PHOTO_FILE_NOT_FOUND);

    const file = createReadStream(filepath);
    return new StreamableFile(file);
  }
}
