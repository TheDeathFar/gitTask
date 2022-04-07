import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useAppDispatch } from '#redux/store';
import { UserActions } from '#redux/reducers/slices/user-slice';
import { UserItemsActions } from '#redux/reducers/slices/user-items-slice';
import { CategoriesActions } from '#redux/reducers/slices/categories-slice';
import { AccountsActions } from '#redux/reducers/slices/accounts-slice';
import { CatalogueActions } from '#redux/reducers/slices/catalogue-slice';
import { BasketActions } from '#redux/reducers/slices/basket-slice';
import { ItemActions } from '#redux/reducers/slices/item-slice';
import { TradeActions } from '#redux/reducers/slices/trade-slice';
import { UserTradesActions } from '#redux/reducers/slices/user-trades-slice';

const Logout: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(AccountsActions.reset());
    dispatch(BasketActions.reset());
    dispatch(CatalogueActions.reset());
    dispatch(CategoriesActions.reset());
    dispatch(ItemActions.reset());
    dispatch(TradeActions.reset());
    dispatch(UserItemsActions.reset());
    dispatch(UserActions.logout());
    dispatch(UserTradesActions.reset());
    // eslint-disable-next-line
  }, []);

  return (
    <Redirect to={`/`} />
  );
};

export default Logout;