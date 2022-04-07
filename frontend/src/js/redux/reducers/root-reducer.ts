import { combineReducers } from 'redux';
import { userReducer } from '#redux/reducers/slices/user-slice';
import { userItemsReducer } from '#redux/reducers/slices/user-items-slice';
import { categoriesReducer } from '#redux/reducers/slices/categories-slice';
import { accountsReducer } from '#redux/reducers/slices/accounts-slice';
import { catalogueReducer } from '#redux/reducers/slices/catalogue-slice';
import { itemReducer } from '#redux/reducers/slices/item-slice';
import { basketReducer } from '#redux/reducers/slices/basket-slice';
import { tradeReducer } from '#redux/reducers/slices/trade-slice';
import { userTradesReducer } from '#redux/reducers/slices/user-trades-slice';

const rootReducer = combineReducers({
  userReducer,
  userItemsReducer,
  categoriesReducer,
  accountsReducer,
  catalogueReducer,
  itemReducer,
  basketReducer,
  tradeReducer,
  userTradesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;