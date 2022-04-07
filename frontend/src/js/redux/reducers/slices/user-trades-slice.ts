import { PaginationResult, PREState } from '#redux/reducers/util/pre-state';
import { createSlice } from '@reduxjs/toolkit';
import { Operations } from '#redux/operations/operations';
import { GetUserOwnedTradesOperationResult } from '#redux/operations/slices/get-user-owned-trades-list-operation';
import {
  onErrorSaveResult,
  onPaginatedOpFulfilled,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';
import { getUserIncomingTradesOperation } from '#redux/operations/slices/get-user-incoming-trades-list-operation';

export interface TradeofferListResult extends PaginationResult<GetUserOwnedTradesOperationResult> {}

interface PRETradeofferList extends PREState<TradeofferListResult> {}

const initialState: {
  owned: PRETradeofferList,
  incoming: PRETradeofferList,
} = {
  owned: {
    pending: false,
    result: {
      currentMeta: null,
      pages: {},
    },
    error: null,
  },
  incoming: {
    pending: false,
    result: {
      currentMeta: null,
      pages: {},
    },
    error: null,
  },
};

const userTradesSlice = createSlice({
  name: `user-trades`,
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.resetUserTrades.fulfilled, () => initialState)

      .addCase(Operations.getUserOwnedTrades.pending, (state) => {
        onPendingSaveResult(state.owned);
      })
      .addCase(Operations.getUserOwnedTrades.rejected, (state, action) => {
        onErrorSaveResult(state.owned, action);
      })
      .addCase(Operations.getUserOwnedTrades.fulfilled, (state, action) => {
        onPaginatedOpFulfilled(state.owned, action);
      })

      .addCase(Operations.getUserIncomingTrades.pending, (state) => {
        onPendingSaveResult(state.incoming);
      })
      .addCase(Operations.getUserIncomingTrades.rejected, (state, action) => {
        onErrorSaveResult(state.incoming, action);
      })
      .addCase(Operations.getUserIncomingTrades.fulfilled, (state, action) => {
        onPaginatedOpFulfilled(state.incoming, action);
      });
  },
});

export const UserTradesActions = userTradesSlice.actions;

export const userTradesReducer = userTradesSlice.reducer;