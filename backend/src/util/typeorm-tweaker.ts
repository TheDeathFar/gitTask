import {
  Brackets,
  FindOperator,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { ClassConstructor } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

export type TweakableObject<T> = {
  [P in keyof T]?: T[P] extends Record<string, any>
    ? Array<TweakableObject<T[P]>> | TweakableObject<T[P]> | T[P]
    : TweakableObject<T[P]> | T[P] | FindOperator<T[P]>;
};

export interface TypeOrmTweakerOptions {
  /**
   * Все встреченные вложенные объекты будут считаться за связь, будет
   * выполнен leftJoinAndSelect
   * */
  autoJoin?: boolean;
  /**
   * Укажите вручную связи, для которых нужно выполнить leftJoinAndSelect
   * */
  relations?: string[];
}

/**
 * TypeOrm работает каким-то невероятно странным образом. Репозиторий не умеет
 * некоторых вещей, которые необходимы при построении чуть более сложного
 * запроса, чем "выбери все из user".
 *
 * К примеру, вот этот issue: <https://github.com/typeorm/typeorm/issues/4396>
 * Хоть его, и относящийся к нему, закрыли, все равно такой код не работает:
 *
 * await this.tradeoffersRepository.find({
 *   where: {
 *     offered_item: {
 *       name: `dcf3dbab73`,
 *     }
 *   },
 * }),
 *
 * Просто возвращается пустой массив, хотя предмет с таким именем есть.
 * Приходится использовать всякие твики, как например предложили здесь:
 * <https://github.com/typeorm/typeorm/issues/4396#issuecomment-666248540>
 *
 * Для упрощения кода написал свою функцию, конвертирующую обычный объект
 * в код, использующий Query Builder.
 *
 * С моей функцией все становится чуть проще, но
 *
 * 1) Или используемые отношения должны быть eager (не работает с nestjs-typeorm-paginate)
 *    Или нужно использовать autoJoin = true или указать relations
 *
 * 2) В функцию надо передать первым параметром конструктор класса
 *
 * 3) Вторым параметром передается либо массив из сущностей, либо сущность
 *
 *
 * Что она позволяет делать:
 *
 * 1) Использовать массивы для конкретного ключа (подразумевая OR)
 *
 * 2) "Поставить скобки", добавив в любом месте посреди объекта массив,
 *    указав ключом Symbol. **В этом массиве должны быть объекты типа
 *    <code>{ sql: string, params: {...} }</code>. Значения передадутся в
 *    qb.orWhere(sql, params).** В TweakableObject указать этот тип не смог,
 *    потому что возможность указать Symbol ключом появится только в 4.4
 *    версии TS, а он выходит в день сдачи, лол
 *    https://github.com/microsoft/TypeScript/issues/44237
 *
 *    Кроме того, в sql можно указать "$currentName", и туда подставится
 *    текущее имя в связях. Но дальше придется делать все руками:
 *    * связи пишутся через "\_" ($currentName_user_photo_...)
 *    * поля пишутся через "." ($currentName_desired_item.name)
 *    Это не моя придумка, это происходит автоматически при указании eager
 *
 *
 * 3) Искать по связям любой вложенности
 *
 * 4) Использовать relations даже в qb ( добавит leftJoinAndSelect с указанными
 *    связями )
 *
 * Надеюсь, я не изобрел велосипед, но код выше действительно не работает,
 * а решений я не нашел, хотя искал долго. Надо было бы еще тестами покрыть,
 * но не успею
 * */

// Можно добавить префикс
const TWEAKER_PREFIX = ``;

const placePrefix = (purePath: string): string => {
  if (!TWEAKER_PREFIX) return purePath;

  return `${TWEAKER_PREFIX}_${purePath}`;
};

const placePrefixIfNeeded = (entName: string, purePath: string): string => {
  if (purePath.slice(0, purePath.indexOf(`.`)) !== entName) {
    return placePrefix(purePath);
  }

  return purePath;
};

export const whereTweaker = <T>(
  cls: ClassConstructor<T>,
  obj: TweakableObject<T>,
  opt: TypeOrmTweakerOptions = {},
): ((qb: SelectQueryBuilder<any>) => void) => {
  const entName = cls.name;

  return (qb) => {
    let columns: Array<string[]> = [];

    if (opt.relations) {
      columns = opt.relations.map((item) => {
        const dotIndex = item.lastIndexOf(`.`);
        const lastColumn = item.slice(dotIndex + 1, item.length);

        let oldPath: string;
        if (dotIndex === -1) oldPath = ``;
        else oldPath = `_` + item.slice(0, dotIndex);

        const path = entName + oldPath.replace(/\./g, `_`);

        return [`${path}.${lastColumn}`, placePrefix(`${path}_${lastColumn}`)];
      });
    }

    if (opt.autoJoin) {
      recursiveScanner(qb, columns, entName, null, obj);
    }

    // Сортируем в алфавитном порядке, чтобы родительские связи подгрузились раньше
    // Кроме того уберем дубликаты
    columns.sort();
    const seen = [];
    columns = columns.filter((item) => {
      if (!seen.includes(item[0])) {
        seen.push(item[0]);
        return true;
      }

      return false;
    });

    for (const col of columns) {
      // Если вложенная связь, то мы ее именуем, как TWEAKER_PREFIX_...
      qb.leftJoinAndSelect(placePrefixIfNeeded(entName, col[0]), col[1]);
    }

    if (Array.isArray(obj)) {
      // Массив (согласно типам - из сущностей, примитивов там не будет)
      // => начинаем с or
      for (const value of obj) {
        // Ключа у массива по очевидным причинам нет
        recursiveTweaker(qb, `or`, entName, entName, null, value);
      }
    } else {
      // Объект
      // => начинаем с and
      for (const [key, value] of [
        ...Object.entries(obj),
        ...Object.getOwnPropertySymbols(obj).map((k) => [k, obj[k]]),
      ]) {
        recursiveTweaker(qb, `and`, entName, entName, key, value);
      }
    }
    // console.log(qb.getSql());
  };
};

const autoWhere = (
  qb: SelectQueryBuilder<any>,
  operator: `and` | `or`,
  payload: string | Brackets,
  params?: ObjectLiteral,
) => {
  if (operator === `and`) qb.andWhere(payload, params);
  else qb.orWhere(payload, params);
};

const stopTweaker = (
  qb,
  operator: `and` | `or`,
  entName,
  currentName,
  key,
  value,
) => {
  const unqStr = uuidv4().replace(/-/g, `_`);
  if (!key) throw new Error(`Array must contain objects`);
  autoWhere(
    qb,
    operator,
    `${placePrefixIfNeeded(entName, currentName)}.${key} = :value_${unqStr}`,
    {
      [`value_${unqStr}`]: value,
    },
  );
};

const recursiveTweaker = (
  qb,
  operator: `and` | `or`,
  entName,
  currentName,
  key,
  value,
  raw = false,
): void => {
  if (raw) {
    // Ключ символ, а в значении находился массив вида
    // {sql: string, params: {...}} для передачи в qb
    autoWhere(
      qb,
      operator,
      value.sql.replace(
        /\$currentName/g,
        placePrefixIfNeeded(entName, currentName),
      ),
      value.params,
    );
    return;
  }

  if (value instanceof FindOperator) {
    // Осторожно, вот здесь можно sql инъекцию пропустить
    if (value.type === `raw`) {
      autoWhere(qb, operator, `${currentName}.${key} ${value.value}`);
    } else {
      throw new Error(
        `Тип FindOperator-a ${value.type} не поддерживается, используйте Raw, но не забывайте про sql injection`,
      );
    }
    return;
  }
  if (typeof value === `object` || typeof value === `undefined`) {
    if (value === null || value === undefined) {
      // null или undefined
      // => для sql это null

      stopTweaker(qb, operator, entName, currentName, key, null);
    } else if (Array.isArray(value)) {
      // Массив (=> много or в скобках)
      if (value.length) {
        autoWhere(
          qb,
          operator,
          new Brackets((qb) => {
            for (const innerValue of value) {
              // Посреди объекта передали массив
              // => ставим скобки и внутри делаем or
              const isSymbol = typeof key === `symbol`;
              const newEntName = isSymbol
                ? currentName
                : `${currentName}_${key}`;
              recursiveTweaker(
                qb,
                `or`,
                entName,
                newEntName,
                null,
                innerValue,
                isSymbol,
              );
            }
          }),
        );
      }
    } else {
      // Считаем, что обычный объект {...}
      // => много И

      autoWhere(
        qb,
        operator,
        new Brackets((qb) => {
          for (const [innerKey, innerValue] of [
            ...Object.entries(value),
            ...Object.getOwnPropertySymbols(value).map((k) => [k, value[k]]),
          ]) {
            const newEntName = key ? `${currentName}_${key}` : currentName;
            recursiveTweaker(
              qb,
              `and`,
              entName,
              newEntName,
              innerKey,
              innerValue,
            );
          }
        }),
      );
    }
  } else {
    // obj - примитив, конец рекурсии

    stopTweaker(qb, operator, entName, currentName, key, value);
  }
};

const recursiveScanner = (
  qb,
  columns: Array<string[]>,
  currentName,
  key,
  value,
  raw = false,
) => {
  if (raw || value instanceof FindOperator) {
    // todo Можно попытаться как-то анализировать строчку sql
    // Но тогда надо вернуть проверку на символьные ключи в циклах
    return;
  }

  if (typeof value === `object` || typeof value === `undefined`) {
    if (!value) {
      // Примитив не интересен
      return;
    } else if (Array.isArray(value)) {
      // Массив
      // (=> сохраняем ключ 1 раз)

      if (key) {
        columns.push([
          `${currentName}.${key}`,
          `${placePrefix(currentName)}_${key}`,
        ]);
      }

      for (const innerValue of value) {
        // Посреди объекта передали массив
        // => ставим скобки и внутри делаем or

        recursiveScanner(
          qb,
          columns,
          `${currentName}_${key}`,
          null,
          innerValue,
        );
      }
    } else {
      // Считаем, что обычный объект {...}
      // => сохраняем ключ, пробегаемся по значению

      if (key) {
        columns.push([
          `${currentName}.${key}`,
          `${placePrefix(currentName)}_${key}`,
        ]);
      }

      for (const [innerKey, innerValue] of Object.entries(value)) {
        const newEntName = key ? `${currentName}_${key}` : currentName;
        recursiveScanner(qb, columns, newEntName, innerKey, innerValue);
      }
    }
  } else {
    // Примитив не интересен
    return;
  }
};
