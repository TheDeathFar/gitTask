import { createSlice } from '@reduxjs/toolkit';
import { Operations } from '#redux/operations/operations';
import { LoginOperationResult } from '#redux/operations/slices/login-operation';
import {
  onError,
  onErrorSaveResult,
  onFulfilled,
  onPending,
  onPendingSaveResult,
} from '#redux/reducers/util/operation-callback';
import { PREState, resetPreState } from '#redux/reducers/util/pre-state';

export const USER_SLICE_NAME = `user`;

const initialState: PREState<LoginOperationResult> = {
  pending: false,
  result: null,
  error: null,
};

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState: initialState,
  reducers: {
    logout: resetPreState,
    stateFromStorage: () => {
      let stateFromStorage;
      try {
        stateFromStorage = JSON.parse(localStorage.getItem(USER_SLICE_NAME));
      } catch (e) {
        stateFromStorage = null;
      }

      if (stateFromStorage)
        return stateFromStorage;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Operations.login.pending, onPending)
      .addCase(Operations.login.rejected, onError)
      .addCase(Operations.login.fulfilled, onFulfilled)

      .addCase(Operations.registration.pending, onPending)
      .addCase(Operations.registration.rejected, onError)
      .addCase(Operations.registration.fulfilled, onFulfilled)

      .addCase(Operations.editProfile.pending, onPendingSaveResult)
      .addCase(Operations.editProfile.rejected, onErrorSaveResult)
      .addCase(Operations.editProfile.fulfilled, onFulfilled)

      .addCase(Operations.setPhoto.pending, onPendingSaveResult)
      .addCase(Operations.setPhoto.rejected, onErrorSaveResult)
      .addCase(Operations.setPhoto.fulfilled, onFulfilled)

      .addCase(Operations.changePassword.pending, onPendingSaveResult)
      .addCase(Operations.changePassword.rejected, onErrorSaveResult)
      .addCase(Operations.changePassword.fulfilled, onFulfilled)

      .addCase(Operations.checkUserExistence.pending, onPendingSaveResult)
      .addCase(Operations.checkUserExistence.rejected, onErrorSaveResult)
      .addCase(Operations.checkUserExistence.fulfilled, (state, action) => {
        state.error = null;
        state.pending = false;
        // Профиль юзера был удален, выйдем из профиля
        if (action.payload === false) {
          resetPreState(state);
        }
      });
  },
});

export const UserActions = userSlice.actions;

export const userReducer = userSlice.reducer;