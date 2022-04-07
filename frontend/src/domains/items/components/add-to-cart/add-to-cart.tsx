import React, { FC, useMemo } from 'react';
import { BasketActions } from '#redux/reducers/slices/basket-slice';
import deleteFromCart from '#src/icons/delete-from-cart.svg';
import addToCart from '#src/icons/add-to-cart.svg';
import { useAppDispatch } from '#redux/store';
import { ItemDto } from '#server/common/dto/item.dto';
import { useSelector } from 'react-redux';
import { sumBasketContentSelector, userDataSelector } from '#redux/selectors';

interface Props {
  item: ItemDto;
}

export const AddToCart: FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const userData = useSelector(userDataSelector);
  const basketContent = useSelector(sumBasketContentSelector);
  const isInBasket = useMemo(() => basketContent[item.id], [basketContent, item]);
  const isUserItem = useMemo(() => item.user === userData.username, [item, userData]);

  return (
    <>
      <button disabled={!!item.to_where_offered}
              className={`uk-button ${(isInBasket) ? `uk-button-primary` : `uk-button-default`}`} onClick={() => {
        if (isInBasket) {
          dispatch(BasketActions.delete(item.id));
        } else {
          if (isUserItem) {
            dispatch(BasketActions.setOffered(item));
          } else {
            dispatch(BasketActions.setDesired(item));
          }
        }
      }} uk-tooltip={`title: ${(item.to_where_offered) ? `Уже создан обмен` : ``}; pos: right;`}>
        <img className={`uk-icon uk-icon-image`} alt={`basket action`} src={(isInBasket) ? deleteFromCart : addToCart}
             uk-svg={``} />
      </button>
    </>
  );
};