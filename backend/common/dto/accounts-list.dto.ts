import { UserDto } from '#server/common/dto/user.dto';
import { AppPagination } from '#server/common/classes/pagination';

export class AccountsListDto extends AppPagination<UserDto> {}
