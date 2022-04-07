import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { TradeoffersListDto } from '#server/common/dto/tradeoffers-list.dto';

export class GetUserOwnedTradesOperationResult extends TradeoffersListDto {}

export const getUserOwnedTradesOperation: AsyncThunkPayloadCreator<GetUserOwnedTradesOperationResult, PaginationRequestDto, { rejectValue: SerializedAxiosError }> =
  async (props, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GetUserOwnedTradesOperationResult>(`trade/owned`, {
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