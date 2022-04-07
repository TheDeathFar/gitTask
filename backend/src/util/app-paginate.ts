import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import {
  TweakableObject,
  TypeOrmTweakerOptions,
  whereTweaker,
} from '#src/util/typeorm-tweaker';
import { ClassConstructor } from 'class-transformer';
import { PAGE_SIZE } from '#server/common/constants/constants';

/**
 * При передаче в запросе order=..., нужно указать путь к нужному полю
 * Например, если мы хотим отсортировать по имени пользователя - надо передать
 * order=profile.filename
 * */

const getOrderColumn = (entName: string, queryOrder: string): string => {
  const dotIndex = queryOrder.lastIndexOf(`.`);
  const lastColumn = queryOrder.slice(dotIndex + 1, queryOrder.length);

  let oldPath: string;
  if (dotIndex === -1) oldPath = ``;
  else oldPath = `_` + queryOrder.slice(0, dotIndex);

  return entName + oldPath.replace(/\./g, `_`) + `.` + lastColumn;
};

/**
 * Обертка над пагинатором, использующая внутри мой твикер для упрощения написания запросов.
 * Что она сделать не сможет:
 *
 * 1) Нормально спагинировать запрос, где будет произведен джоин по свзязи один ко многим или
 *    многие ко многим. Например, если вы получаете вещи и хотите присоединить фотографии, а
 *    у каждой вещи их может быть несколько. В этом случае библиотека считает уже сджойненные
 *    поля и выдает неверные числа (к примеру, на странице должно быть 20 записей, а она выдаст
 *    13, потому что ошиблась в подсчетах)
 *
 *    В теории, это можно исправить. Возможно, будет работать при paginationType: TAKE_AND_SKIP,
 *    но пока что возникает ошибка, duplicated columns. Что-то с этим сделать не смог. Попытался
 *    поставить префикс у каждого элиаса, но ничего не изменилось. Потом понял, в чем дело:
 *    leftJoinAndSelect создает sql такого вида:
 *
 *    ...
 *
 *    \`TradeOfferEntity\`.\`desired_item_id\` AS \`TradeOfferEntity_desired_item_id\`,
 *
 *    \`TradeOfferEntity_desired_item\`.\`id\` AS \`TradeOfferEntity_desired_item_id\`,
 *
 *    ...
 *
 *    А исключить какие-то поля из селекта нельзя, можно только указать те, которые нужно взять.
 *    То есть мне придется как-то узнать все поля, это тяжеловато
 *
 *    Поэтому:
 *
 *    **Можно использовать только в сущностях без множественных связей**
 *
 * Остальное - пожалуйста
 *
 * */

export const appPaginate = async <T>(
  entityRepository: Repository<T>,
  paginationRequestDto: PaginationRequestDto,
  tweakerWhere: TweakableObject<T>,
  tweakerOptions?: TypeOrmTweakerOptions,
): Promise<Pagination<T>> => {
  const {
    page = 1,
    order = `id`,
    orderDirection = `ASC`,
  } = paginationRequestDto;
  // Получим конструктор энтити
  const entCls = entityRepository.target as ClassConstructor<T>;

  // Построим стандартный запрос с сортировкой
  // При этом фильтрацию по query необходимо произвести самостоятельно
  // внутри tweakerWhere
  const qb = entityRepository
    .createQueryBuilder()
    .where(whereTweaker(entCls, tweakerWhere, tweakerOptions))
    .orderBy(
      getOrderColumn(entCls.name, order),
      orderDirection.toUpperCase() as `ASC` | `DESC`,
    );

  // С твикером все работает при запросах любой сложности, а не как обычно
  // Но на сущностях со множественными связями не заработает
  return await paginate<T>(qb, {
    page,
    limit: PAGE_SIZE,
    paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
  });
};
