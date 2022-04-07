import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from '#src/modules/item/item.service';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { RolesGuard } from '#src/modules/auth/guards/roles.guard';
import { EditItemDto } from '#server/common/dto/edit-item.dto';
import { PhotosInterceptor } from '#src/modules/auth/interceptors/photo-interceptor';
import { SetItemPhotosDto } from '#server/common/dto/set-item-photos.dto';
import { CreateItemDto } from '#server/common/dto/create-item.dto';

@UseGuards(RolesGuard)
@Controller(`item`)
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Post(`create`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor, PhotosInterceptor(`photos`))
  async createItem(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @Request() req,
    @Body() body: CreateItemDto,
  ) {
    return await this.itemService.createItem(req.user, {
      ...body,
      photosPaths: photos?.map((item) => item.path),
    });
  }

  @Get(`:itemId`)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async getItem(@Request() req, @Param(`itemId`, ParseIntPipe) id: number) {
    return await this.itemService.getItem(req.user, id);
  }

  @Delete(`:itemId`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteItem(@Request() req, @Param(`itemId`, ParseIntPipe) id: number) {
    return await this.itemService.removeItem(req.user, id);
  }

  @Patch(`:itemId`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async editItem(
    @Request() req,
    @Param(`itemId`, ParseIntPipe) id: number,
    @Body() body: EditItemDto,
  ) {
    return await this.itemService.editItem(req.user, id, body);
  }

  @Put(`:itemId/photos`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor, PhotosInterceptor())
  async setItemPhotos(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @Request() req,
    @Body() body: SetItemPhotosDto,
  ) {
    return await this.itemService.setItemPhotos(req.user, photos, body.id);
  }
}
