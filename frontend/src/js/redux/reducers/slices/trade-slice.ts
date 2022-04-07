import { PREState, resetPreState } from '#redux/reducers/util/pre-state';
import { CreateTradeOperationResult } from '#redux/operations/slices/create-trade-operation';
import { createSlice } from '@reduxjs/toolkit';
import { Operations } from '#redux/operations/operations';
import { onErrorSaveResult, onFulfilled, onPendingSaveResult } from '#redux/reducers/util/operation-callback';

const initialState: PREState<CreateTradeOperationResult> = {
  pending: false,
  result: null,
  error: null,
};

const tradeSlice = createSlice({
  name: `trade`,
  initialState,
  reducers: {
    reset: resetPreState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.cancelTrade.pending, onPendingSaveResult)
      .addCase(Operations.cancelTrade.rejected, onErrorSaveResult)
      .addCase(Operations.cancelTrade.fulfilled, resetPreState)

      .addCase(Operations.acceptTrade.pending, onPendingSaveResult)
      .addCase(Operations.acceptTrade.rejected, onErrorSaveResult)
      .addCase(Operations.acceptTrade.fulfilled, resetPreState)

      .addCase(Operations.createTrade.pending, onPendingSaveResult)
      .addCase(Operations.createTrade.rejected, onErrorSaveResult)
      .addCase(Operations.createTrade.fulfilled, onFulfilled);
  },
});

export const TradeActions = tradeSlice.actions;

export const tradeReducer = tradeSlice.reducer;