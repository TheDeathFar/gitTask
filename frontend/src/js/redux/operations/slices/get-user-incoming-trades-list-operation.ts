import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { TradeoffersListDto } from '#server/common/dto/tradeoffers-list.dto';

export class GetUserIncomingTradesOperationResult extends TradeoffersListDto {}

export const getUserIncomingTradesOperation: AsyncThunkPayloadCreator<GetUserIncomingTradesOperationResult, PaginationRequestDto, { rejectValue: SerializedAxiosError }> =
  async (props, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GetUserIncomingTradesOperationResult>(`trade/incoming`, {
        params: props,
      });
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };