import { PaginationResult, PREState, resetPaginationState } from '#redux/reducers/util/pre-state';
import { createSlice } from '@reduxjs/toolkit';
import { LoadCatalogueOperationResult } from '#redux/operations/slices/load-catalogue-operation';
import { Operations } from '#redux/operations/operations';
import {
  onErrorSaveResult,
  onPaginatedOpFulfilled,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';

export interface CatalogueResult extends PaginationResult<LoadCatalogueOperationResult> {}

const initialState: PREState<CatalogueResult> = {
  pending: false,
  result: {
    currentMeta: null,
    pages: {},
  },
  error: null,
};

const catalogueSlice = createSlice({
  name: `catalogue`,
  initialState,
  reducers: {
    reset: resetPaginationState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.loadCatalogue.pending, onPendingSaveResult)
      .addCase(Operations.loadCatalogue.rejected, onErrorSaveResult)
      .addCase(Operations.loadCatalogue.fulfilled, onPaginatedOpFulfilled)

      .addCase(Operations.loadRecommendations.pending, onPendingSaveResult)
      .addCase(Operations.loadRecommendations.rejected, onErrorSaveResult)
      .addCase(Operations.loadRecommendations.fulfilled, onPaginatedOpFulfilled)

      .addCase(Operations.deleteCatalogueItem.pending, onPendingSaveResult)
      .addCase(Operations.deleteCatalogueItem.rejected, onErrorSaveResult)
      .addCase(Operations.deleteCatalogueItem.fulfilled, (state, action) => {
        state.pending = false;
        state.error = null;
        if (action.payload) {
          // Очищаем целиком хранилище
          resetPaginationState(state);
        }
      });
  },
});

export const CatalogueActions = catalogueSlice.actions;

export const catalogueReducer = catalogueSlice.reducer;