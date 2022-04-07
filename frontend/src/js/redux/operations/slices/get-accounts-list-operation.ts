import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { AccountsListDto } from '#server/common/dto/accounts-list.dto';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';

export class GetAccountsListOperationResult extends AccountsListDto {
}

export const getAccountsListOperation: AsyncThunkPayloadCreator<GetAccountsListOperationResult, PaginationRequestDto, { rejectValue: SerializedAxiosError }> =
  async (props, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GetAccountsListOperationResult>(`accounts`, {
        params: props
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