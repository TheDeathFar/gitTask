import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { Operations } from '#redux/operations/operations';
import { TradeofferDto } from '#server/common/dto/tradeoffer.dto';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';

export class CreateTradeOperationResult extends TradeofferDto {}

export const createTradeOperation: AsyncThunkPayloadCreator<CreateTradeOperationResult,
  CreateTradeofferDto,
  { rejectValue: SerializedAxiosError }> = async (data, {
  rejectWithValue,
  dispatch,
}) => {
  try {
    const res = await axiosInstance.post<CreateTradeOperationResult>(`trade/create`, data);

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