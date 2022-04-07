import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { Operations } from '#redux/operations/operations';

export type CancelTradeOperationResult = boolean;

export const cancelTradeOperation: AsyncThunkPayloadCreator<CancelTradeOperationResult, number, { rejectValue: SerializedAxiosError }> =
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.delete<CancelTradeOperationResult>(`trade/${id}`);

      // Обновим информацию и в списке трейдофферов
      dispatch(Operations.resetUserTrades());

      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };