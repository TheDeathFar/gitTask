import { createSelector, Selector } from 'reselect';
import { RootState } from '#redux/reducers/root-reducer';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { UserDto } from '#server/common/dto/user.dto';
import jwtDecode from 'jwt-decode';
import { CategoriesListDto } from '#server/common/dto/categories-list.dto';
import { srcFromPhotoPath } from '#src/js/util/src-from-photo-path';
import { UserRole } from '#server/common/enums/user-role.enum';
import { CatalogueResult } from '#redux/reducers/slices/catalogue-slice';
import { ItemDto } from '#server/common/dto/item.dto';
import { AppPaginationMeta } from '#server/common/classes/pagination';
import { ItemsResult } from '#redux/reducers/slices/user-items-slice';
import { AccountsResult } from '#redux/reducers/slices/accounts-slice';
import { BasketContent } from '#redux/reducers/slices/basket-slice';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';
import { TradeofferListResult } from '#redux/reducers/slices/user-trades-slice';

interface AppSelector<T> extends Selector<RootState, T> {}

export const isUserRequestPendingSelector: AppSelector<boolean> = (state) => state.userReducer.pending;

export const jwtTokenSelector: AppSelector<string> = (state) => state.userReducer.result?.access_token;

export const userRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.userReducer.error;

export const isAuthorizedSelector = createSelector<RootState, string, boolean>(
  jwtTokenSelector,
  (res) => !!res,
);

export const userDataSelector = createSelector<RootState, string, UserDto>(
  jwtTokenSelector,
  (jwtToken) => (jwtToken) ? jwtDecode(jwtToken) as UserDto : undefined,
);

export const isAdminSelector = createSelector<RootState, UserDto, boolean>(
  userDataSelector,
  (userData) => userData?.role && userData.role === UserRole.ADMIN,
);

export const isUserSelector = createSelector<RootState, UserDto, boolean>(
  userDataSelector,
  (userData) => userData?.role && userData.role === UserRole.USER,
);

export const userPhotoUrlSelector = createSelector<RootState, UserDto, string>(
  userDataSelector,
  (userData) => (userData?.photoPath)
    ? srcFromPhotoPath(userData.photoPath)
    : undefined,
);

export const isItemsRequestPendingSelector: AppSelector<boolean> = (state) => state.userItemsReducer.pending;

export const itemsResultSelector: AppSelector<ItemsResult> = (state) => state.userItemsReducer.result;

export const itemsCurrentMetaSelector = createSelector<RootState, ItemsResult, AppPaginationMeta>(
  itemsResultSelector,
  (catalogueResult) => catalogueResult.currentMeta,
);

export const itemsListSelector = createSelector<RootState, ItemsResult, Array<ItemDto>>(
  itemsResultSelector,
  (itemsResult) => {
    const items: Array<ItemDto> = [];
    for (const page of Object.values(itemsResult.pages)) {
      items.push(...page.items);
    }
    return items;
  },
);


export const itemsRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.userItemsReducer.error;

export const isCategoriesRequestPendingSelector: AppSelector<boolean> = (state) => state.categoriesReducer.pending;

export const categoriesListSelector: AppSelector<CategoriesListDto> = (state) => state.categoriesReducer.result;

export const categoriesRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.categoriesReducer.error;

export const isAccountsRequestPendingSelector: AppSelector<boolean> = (state) => state.accountsReducer.pending;

export const accountsResultSelector: AppSelector<AccountsResult> = (state) => state.accountsReducer.result;

export const accountsCurrentMetaSelector = createSelector<RootState, AccountsResult, AppPaginationMeta>(
  accountsResultSelector,
  (catalogueResult) => catalogueResult.currentMeta,
);

export const accountsListSelector = createSelector<RootState, AccountsResult, Array<UserDto>>(
  accountsResultSelector,
  (accountsResult) => {
    const accounts: Array<UserDto> = [];
    for (const page of Object.values(accountsResult.pages)) {
      accounts.push(...page.items);
    }
    return accounts;
  },
);

export const accountsRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.accountsReducer.error;

export const isCatalogueRequestPendingSelector: AppSelector<boolean> = (state) => state.catalogueReducer.pending;

export const catalogueResultSelector: AppSelector<CatalogueResult> = (state) => state.catalogueReducer.result;

export const catalogueCurrentMetaSelector = createSelector<RootState, CatalogueResult, AppPaginationMeta>(
  catalogueResultSelector,
  (catalogueResult) => catalogueResult.currentMeta,
);

export const catalogueItemsSelector = createSelector<RootState, CatalogueResult, Array<ItemDto>>(
  catalogueResultSelector,
  (catalogueResult) => {
    const items: Array<ItemDto> = [];
    for (const page of Object.values(catalogueResult.pages)) {
      items.push(...page.items);
    }
    return items;
  },
);

export const catalogueRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.catalogueReducer.error;

export const isCurrentItemRequestPendingSelector: AppSelector<boolean> = (state) => state.itemReducer.pending;
export const currentItemSelector: AppSelector<ItemDto> = (state) => state.itemReducer.result;
export const currentItemErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.itemReducer.error;

export const basketOfferedSelector: AppSelector<BasketContent> = (state) => state.basketReducer.offered;
export const basketDesiredSelector: AppSelector<BasketContent> = (state) => state.basketReducer.desired;
export const basketOfferedLengthSelector = createSelector<RootState, BasketContent, number>(
  basketOfferedSelector,
  (offered) => Object.keys(offered).length,
);
export const basketDesiredLengthSelector = createSelector<RootState, BasketContent, number>(
  basketDesiredSelector,
  (desired) => Object.keys(desired).length,
);

export const sumBasketContentSelector = createSelector<RootState, BasketContent, BasketContent, BasketContent>(
  basketOfferedSelector,
  basketDesiredSelector,
  (offered, desired) => ({
    ...offered,
    ...desired,
  }),
);

export const isTradeRequestPendingSelector: AppSelector<boolean> = (state) => state.tradeReducer.pending;

export const tradeRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.tradeReducer.error;

export const tradeRequestResultSelector: AppSelector<TradeofferDto> = (state) => state.tradeReducer.result;

export const isUserOwnedTradesRequestPendingSelector: AppSelector<boolean> = (state) => state.userTradesReducer.owned.pending;

export const userOwnedTradesResultSelector: AppSelector<TradeofferListResult> = (state) => state.userTradesReducer.owned.result;

export const userOwnedTradesCurrentMetaSelector = createSelector<RootState, TradeofferListResult, AppPaginationMeta>(
  userOwnedTradesResultSelector,
  (tradeofferResult) => tradeofferResult.currentMeta,
);

export const userOwnedTradesListSelector = createSelector<RootState, TradeofferListResult, Array<TradeofferDto>>(
  userOwnedTradesResultSelector,
  (tradeofferResult) => {
    const items: Array<TradeofferDto> = [];
    for (const page of Object.values(tradeofferResult.pages)) {
      items.push(...page.items);
    }
    return items;
  },
);

export const userOwnedTradesRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.userTradesReducer.owned.error;

export const isUserIncomingTradesRequestPendingSelector: AppSelector<boolean> = (state) => state.userTradesReducer.incoming.pending;

export const userIncomingTradesResultSelector: AppSelector<TradeofferListResult> = (state) => state.userTradesReducer.incoming.result;

export const userIncomingTradesCurrentMetaSelector = createSelector<RootState, TradeofferListResult, AppPaginationMeta>(
  userIncomingTradesResultSelector,
  (tradeofferResult) => tradeofferResult.currentMeta,
);

export const userIncomingTradesListSelector = createSelector<RootState, TradeofferListResult, Array<TradeofferDto>>(
  userIncomingTradesResultSelector,
  (tradeofferResult) => {
    const items: Array<TradeofferDto> = [];
    for (const page of Object.values(tradeofferResult.pages)) {
      items.push(...page.items);
    }
    return items;
  },
);

export const userIncomingTradesRequestErrorSelector: AppSelector<SerializedAxiosError> = (state) => state.userTradesReducer.incoming.error;
