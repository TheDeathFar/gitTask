import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { Operations } from '#redux/operations/operations';
import { BasketActions } from '#redux/reducers/slices/basket-slice';

export type DeleteItemOperationResult = boolean;

export const deleteItemOperation: AsyncThunkPayloadCreator<DeleteItemOperationResult, number, { rejectValue: SerializedAxiosError }> =
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete<DeleteItemOperationResult>(`item/${id}`);

      // Обновим информацию и в списке предметов
      dispatch(Operations.resetUserItems());
      // И удалим из корзины
      dispatch(BasketActions.delete(id));

      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };