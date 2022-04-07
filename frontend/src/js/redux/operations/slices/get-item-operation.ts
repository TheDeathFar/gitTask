import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { ItemDto } from '#server/common/dto/item.dto';

export class GetItemOperationResult extends ItemDto {
}

export const getItemOperation: AsyncThunkPayloadCreator<GetItemOperationResult, number, { rejectValue: SerializedAxiosError }> =
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GetItemOperationResult>(`item/${id}`);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };