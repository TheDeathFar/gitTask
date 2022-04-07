import { AppPagination } from '#server/common/classes/pagination';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';

export class TradeoffersListDto extends AppPagination<TradeofferDto> {}
