import { ItemDto } from '#server/common/dto/item.dto';
import { AppPagination } from '#server/common/classes/pagination';

export class CatalogueDto extends AppPagination<ItemDto> {}
