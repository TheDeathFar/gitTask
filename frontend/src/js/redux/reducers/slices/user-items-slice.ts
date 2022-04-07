import { PaginationResult, PREState, resetPaginationState } from '#redux/reducers/util/pre-state';
import { createSlice } from '@reduxjs/toolkit';
import { GetUserItemsListOperationResult } from '#redux/operations/slices/get-user-items-list-operation';
import { Operations } from '#redux/operations/operations';
import {
  onErrorSaveResult,
  onPaginatedOpFulfilled,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';

export interface ItemsResult extends PaginationResult<GetUserItemsListOperationResult> {}

const initialState: PREState<ItemsResult> = {
  pending: false,
  result: {
    currentMeta: null,
    pages: {},
  },
  error: null,
};

const userItemsSlice = createSlice({
  name: `user-items`,
  initialState,
  reducers: {
    reset: resetPaginationState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.resetUserItems.fulfilled, resetPaginationState)

      .addCase(Operations.getUserItemsList.pending, onPendingSaveResult)
      .addCase(Operations.getUserItemsList.rejected, onErrorSaveResult)
      .addCase(Operations.getUserItemsList.fulfilled, onPaginatedOpFulfilled);
  },
});

export const UserItemsActions = userItemsSlice.actions;

export const userItemsReducer = userItemsSlice.reducer;