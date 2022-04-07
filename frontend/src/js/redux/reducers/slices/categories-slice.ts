import { PREState, resetPreState } from '#redux/reducers/util/pre-state';
import { createSlice } from '@reduxjs/toolkit';
import { GetCategoriesListOperationResult } from '#redux/operations/slices/get-categories-list-operation';
import { Operations } from '#redux/operations/operations';
import {
  onError,
  onErrorSaveResult,
  onFulfilled,
  onPending,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';

const initialState: PREState<GetCategoriesListOperationResult> = {
  pending: false,
  result: null,
  error: null,
};

const categoriesSlice = createSlice({
  name: `categories`,
  initialState,
  reducers: {
    reset: resetPreState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.getCategoriesList.pending, onPending)
      .addCase(Operations.getCategoriesList.rejected, onError)
      .addCase(Operations.getCategoriesList.fulfilled, onFulfilled)

      .addCase(Operations.deleteCategory.pending, onPendingSaveResult)
      .addCase(Operations.deleteCategory.rejected, onErrorSaveResult)
      .addCase(Operations.deleteCategory.fulfilled, onFulfilled)

      .addCase(Operations.createCategory.pending, onPendingSaveResult)
      .addCase(Operations.createCategory.rejected, onErrorSaveResult)
      .addCase(Operations.createCategory.fulfilled, onFulfilled);
  },
});

export const CategoriesActions = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;