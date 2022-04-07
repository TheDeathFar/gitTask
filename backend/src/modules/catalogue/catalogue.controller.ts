import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Request,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CatalogueService } from '#src/modules/catalogue/catalogue.service';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { CatalogueDto } from '#server/common/dto/catalogue.dto';

@Controller(`catalogue`)
export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getItemsList(
    @Request() req,
    @Query() query: PaginationRequestDto,
  ): Promise<CatalogueDto> {
    return await this.catalogueService.getItemsList(req.user, query);
  }

  @Get(`recommendations`)
  @Roles(UserRole.USER, UserRole.ADMIN)
  async getRecommendationsList(
    @Request() req,
    @Query() query: PaginationRequestDto,
  ): Promise<CatalogueDto> {
    return await this.catalogueService.getRecommendationsList(req.user, query);
  }

  @Delete(`/item/:id`)
  @Roles(UserRole.ADMIN)
  async deleteCatalogueItem(@Param(`id`, ParseIntPipe) id: number) {
    return await this.catalogueService.deleteCatalogueItem(id);
  }
}
