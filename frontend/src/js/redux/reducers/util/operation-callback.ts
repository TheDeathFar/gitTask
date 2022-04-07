
export const onPending = (state) => {
  state.pending = true;
  state.result = null;
  state.error = null;
};

export const onPendingSaveResult = (state) => {
  state.pending = true;
  state.error = null;
};

export const onError = (state, action) => {
  state.pending = false;
  state.result = null;
  state.error = action.payload;
};

export const onErrorSaveResult = (state, action) => {
  state.pending = false;
  state.error = action.payload;
};

export const onFulfilled = (state, action) => {
  state.pending = false;
  state.result = action.payload;
  state.error = null;
};

export const onPaginatedOpFulfilled = (state, action) => {
  state.pending = false;
  state.error = null;
  if (action.payload.items.length > 0) {
    state.result.pages[action.payload.meta.currentPage] = action.payload;
    state.result.currentMeta = action.payload.meta;
  }
};