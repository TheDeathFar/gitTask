import { PREState, resetPreState } from '#redux/reducers/util/pre-state';
import { createSlice } from '@reduxjs/toolkit';
import { Operations } from '#redux/operations/operations';
import {
  onError,
  onErrorSaveResult,
  onFulfilled,
  onPending,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';
import { GetItemOperationResult } from '#redux/operations/slices/get-item-operation';

const initialState: PREState<GetItemOperationResult> = {
  pending: false,
  result: null,
  error: null,
};

const itemSlice = createSlice({
  name: `item`,
  initialState,
  reducers: {
    reset: resetPreState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.getItem.pending, onPending)
      .addCase(Operations.getItem.rejected, onError)
      .addCase(Operations.getItem.fulfilled, onFulfilled)

      .addCase(Operations.deleteItem.pending, onPendingSaveResult)
      .addCase(Operations.deleteItem.rejected, onErrorSaveResult)
      .addCase(Operations.deleteItem.fulfilled, resetPreState)

      .addCase(Operations.createItem.pending, onPendingSaveResult)
      .addCase(Operations.createItem.rejected, onErrorSaveResult)
      .addCase(Operations.createItem.fulfilled, onFulfilled)

      .addCase(Operations.editItem.pending, onPendingSaveResult)
      .addCase(Operations.editItem.rejected, onErrorSaveResult)
      .addCase(Operations.editItem.fulfilled, onFulfilled)

      .addCase(Operations.setItemPhotos.pending, onPendingSaveResult)
      .addCase(Operations.setItemPhotos.rejected, onErrorSaveResult)
      .addCase(Operations.setItemPhotos.fulfilled, onFulfilled);
  },
});

export const ItemActions = itemSlice.actions;

export const itemReducer = itemSlice.reducer;