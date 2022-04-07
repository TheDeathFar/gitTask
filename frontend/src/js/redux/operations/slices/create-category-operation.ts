import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { CategoriesListDto } from '#server/common/dto/categories-list.dto';
import { CreateCategoryDto } from '#server/common/dto/create-category.dto';

export class CreateCategoryOperationResult extends CategoriesListDto {
}

export const createCategoryOperation: AsyncThunkPayloadCreator<CreateCategoryOperationResult, CreateCategoryDto, { rejectValue: SerializedAxiosError }> =
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<CreateCategoryOperationResult>(`categories`, payload);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };