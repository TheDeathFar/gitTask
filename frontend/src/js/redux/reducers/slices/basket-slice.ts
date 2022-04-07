import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ItemDto } from '#server/common/dto/item.dto';
import { USER_SLICE_NAME } from '#redux/reducers/slices/user-slice';

export interface BasketContent {
  [id: number]: ItemDto;
}

interface BasketSliceState {
  offered: BasketContent;
  desired: BasketContent;
}

const initialState: BasketSliceState = {
  offered: {},
  desired: {},
};

export const BASKET_SLICE_NAME = `basket`;

const basketSlice = createSlice({
  name: BASKET_SLICE_NAME,
  initialState,
  reducers: {
    stateFromStorage: () => {
      let stateFromStorage;
      try {
        stateFromStorage = JSON.parse(localStorage.getItem(BASKET_SLICE_NAME));
      } catch (e) {
        stateFromStorage = null;
      }

      if (stateFromStorage)
        return stateFromStorage;
    },
    reset: (state) => {
      state.offered = initialState.offered;
      state.desired = initialState.desired;
    },
    setOffered: (state, action: PayloadAction<ItemDto>) => {
      state.offered[action.payload.id] = action.payload;
    },
    setDesired: (state, action: PayloadAction<ItemDto>) => {
      state.desired[action.payload.id] = action.payload;
    },
    update: (state, action: PayloadAction<ItemDto>) => {
      if (state.offered[action.payload.id])
        state.offered[action.payload.id] = action.payload;
      else if (state.desired[action.payload.id])
        state.desired[action.payload.id] = action.payload;
    },
    delete: (state, action: PayloadAction<number>) => {
      delete state.offered[action.payload];
      delete state.desired[action.payload];
    },
  },
});

export const BasketActions = basketSlice.actions;

export const basketReducer = basketSlice.reducer;