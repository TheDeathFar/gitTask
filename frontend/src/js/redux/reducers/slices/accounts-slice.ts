import { createSlice } from '@reduxjs/toolkit';
import { Operations } from '#redux/operations/operations';
import {
  onErrorSaveResult,
  onPaginatedOpFulfilled,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';
import { PaginationResult, PREState, resetPaginationState } from '#redux/reducers/util/pre-state';
import { GetAccountsListOperationResult } from '#redux/operations/slices/get-accounts-list-operation';

export const ACCOUNTS_SLICE_NAME = `accounts`;

export interface AccountsResult extends PaginationResult<GetAccountsListOperationResult> {}

const initialState: PREState<AccountsResult> = {
  pending: false,
  result: {
    currentMeta: null,
    pages: {},
  },
  error: null,
};

const accountsSlice = createSlice({
  name: ACCOUNTS_SLICE_NAME,
  initialState: initialState,
  reducers: {
    reset: resetPaginationState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.getAccountsList.pending, onPendingSaveResult)
      .addCase(Operations.getAccountsList.rejected, onErrorSaveResult)
      .addCase(Operations.getAccountsList.fulfilled, onPaginatedOpFulfilled)

      .addCase(Operations.deleteAccount.pending, onPendingSaveResult)
      .addCase(Operations.deleteAccount.rejected, onErrorSaveResult)
      .addCase(Operations.deleteAccount.fulfilled, (state, action) => {
        state.pending = false;
        state.error = null;
        if (action.payload) {
          // Очищаем целиком хранилище
          resetPaginationState(state);
        }
      });
  },
});

export const AccountsActions = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;