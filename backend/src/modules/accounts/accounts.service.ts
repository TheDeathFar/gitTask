import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDto } from '#server/common/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '#src/modules/user/entity/user.entity';
import { Repository } from 'typeorm';
import { ErrorMessagesEnum } from '#server/common/enums/error-messages.enum';
import { UserRole } from '#server/common/enums/user-role.enum';
import { AccountsListDto } from '#server/common/dto/accounts-list.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { appPaginate } from '#src/util/app-paginate';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Выгрузка информации о всех пользователях с добавлением данных из Profile
  async findAll(props: PaginationRequestDto): Promise<AccountsListDto> {
    const { query = `` } = props;

    const paginatedUsers = await appPaginate(
      this.userRepository,
      props,
      {
        [Symbol(`AND (.. OR .. OR .. OR)`)]: [
          {
            sql: `$currentName.login LIKE :loginLike`,
            params: {
              loginLike: `%${query}%`,
            },
          },
          {
            sql: `$currentName_profile.firstName LIKE :fnLike`,
            params: {
              fnLike: `%${query}%`,
            },
          },
        ],
      },
      {
        relations: [`profile`],
      },
    );

    return new Pagination<UserDto>(
      paginatedUsers.items.map((user) => user.toDto()),
      paginatedUsers.meta,
    );
  }

  async deleteUser(id): Promise<boolean> {
    const targetUser = await this.userRepository.findOne(id);

    if (!targetUser) {
      throw new NotFoundException(ErrorMessagesEnum.NO_SUCH_USER);
    }

    if (targetUser.role === UserRole.ADMIN) {
      throw new UnauthorizedException(ErrorMessagesEnum.CANT_DELETE_ADMIN);
    }
    await this.userRepository.remove(targetUser);

    return true;
  }
}
