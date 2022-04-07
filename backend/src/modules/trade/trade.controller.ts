import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TradeService } from '#src/modules/trade/trade.service';
import { RolesGuard } from '#src/modules/auth/guards/roles.guard';
import { Roles } from '#src/modules/auth/decorators/roles.decorator';
import { UserRole } from '#server/common/enums/user-role.enum';
import { TradeoffersListDto } from '#server/common/dto/tradeoffers-list.dto';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';
import { ItemEntity } from '#src/modules/user-items/entity/item.entity';
import { TradeOfferEntity } from '#src/modules/trade/entity/trade-offer.entity';

@UseGuards(RolesGuard)
@Controller(`trade`)
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Get(`available_items_for/:itemId`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async getAvailableItems(
    @Request() req,
    @Param(`itemId`, ParseIntPipe) id: number,
  ): Promise<Array<ItemEntity>> {
    return await this.tradeService.getAvailableItems(req.user, id);
  }

  @Get(`owned`)
  @Roles(UserRole.USER)
  async getUserOwnedTradeoffers(
    @Request() req,
    @Query() query,
  ): Promise<TradeoffersListDto> {
    return this.tradeService.getUserOwnedTradeoffers(req.user, query);
  }

  @Get(`incoming`)
  @Roles(UserRole.USER)
  async getUserIncomingTradeoffers(
    @Request() req,
    @Query() query,
  ): Promise<TradeoffersListDto> {
    return this.tradeService.getUserIncomingTradeoffers(req.user, query);
  }

  @Post(`create`)
  @Roles(UserRole.USER)
  @UseInterceptors(ClassSerializerInterceptor)
  async createTradeoffer(
    @Request() req,
    @Body() body: CreateTradeofferDto,
  ): Promise<TradeOfferEntity> {
    return this.tradeService.createTradeoffer(req.user, body);
  }

  @Delete(`:itemId`)
  @Roles(UserRole.USER)
  async cancelTradeoffer(
    @Request() req,
    @Param(`itemId`, ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.tradeService.cancelTradeoffer(req.user, id);
  }

  @Post(`:itemId`)
  @Roles(UserRole.USER)
  async acceptTradeoffer(
    @Request() req,
    @Param(`itemId`, ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.tradeService.acceptTradeoffer(req.user, id);
  }
}
