import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Operations } from '#redux/operations/operations';
import { useAppDispatch } from '#redux/store';
import { ItemDto } from '#server/common/dto/item.dto';
import { AddToCart } from '#domains/items/components/add-to-cart/add-to-cart';

interface Props {
  item: ItemDto;
  isUserItem: boolean;
  withItemActions: boolean;
}

export const ItemActionIcons: FC<Props> = ({ item, isUserItem, withItemActions }) => {
  const dispatch = useAppDispatch();
  const { id } = item;

  return (
    <div className={`ItemActions`}>
      <div className={`uk-width-expand`}>
        <AddToCart item={item} />
      </div>
      {(isUserItem && withItemActions) ? (
        <>
          <Link
            className={`uk-link`}
            to={`/items/${id}/edit`}
            uk-icon={`icon: pencil`}
          />
          <button
            className={`uk-link`}
            uk-icon={`trash`}
            onClick={() => dispatch(Operations.deleteItem(id))}
          />
        </>
      ) : null}
    </div>
  );
};