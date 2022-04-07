import './style.scss';

import React from 'react';
import UIkit from 'uikit';
import App from '#components/app/app';
import ReactDOM from 'react-dom';
import Icons from 'uikit/dist/js/uikit-icons';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '#redux/store';
import { USER_SLICE_NAME, UserActions } from '#redux/reducers/slices/user-slice';
import axiosInstance from '#src/js/axios/axios-instance';
import { Operations } from '#redux/operations/operations';
import { userDataSelector } from '#redux/selectors';
import { BASKET_SLICE_NAME, BasketActions } from '#redux/reducers/slices/basket-slice';

(() => {
  // @ts-ignore
  UIkit.use(Icons);

  store.dispatch(UserActions.stateFromStorage());
  store.dispatch(BasketActions.stateFromStorage());

  if (userDataSelector(store.getState()))
    store.dispatch(Operations.checkUserExistence(userDataSelector(store.getState()).username));

  // Сохранение состояния в localStorage
  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem(
      USER_SLICE_NAME,
      JSON.stringify(state.userReducer),
    );
    localStorage.setItem(
      BASKET_SLICE_NAME,
      JSON.stringify(state.basketReducer),
    );
  });

  // Обновление хедера авторизации в axios
  store.subscribe(() => {
    const userReducer = store.getState().userReducer;
    if (userReducer?.result?.access_token)
      axiosInstance.defaults.headers.common[`Authorization`] = `Bearer ${userReducer.result.access_token}`;
    else
      delete axiosInstance.defaults.headers.common[`Authorization`];
  });

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    document.querySelector(`#root`),
  );
})();