import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { CategoriesListDto } from '#server/common/dto/categories-list.dto';

export class GetCategoriesListOperationResult extends CategoriesListDto {
}

export const getCategoriesListOperation: AsyncThunkPayloadCreator<GetCategoriesListOperationResult, null, { rejectValue: SerializedAxiosError }> =
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<GetCategoriesListOperationResult>(`categories`);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };