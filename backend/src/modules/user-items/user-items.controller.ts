import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { UserItemsService } from '#src/modules/user-items/user-items.service';
import { RolesGuard } from '#src/modules/auth/guards/roles.guard';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { ItemsListDto } from '#server/common/dto/items-list.dto';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';

@UseGuards(RolesGuard)
@Controller(`user_items`)
export class UserItemsController {
  constructor(private itemsService: UserItemsService) {}

  @Get()
  @Roles(UserRole.USER)
  async getItemsList(
    @Request() req,
    @Query() query: PaginationRequestDto,
  ): Promise<ItemsListDto> {
    return await this.itemsService.getItemsList(req.user, query);
  }
}
