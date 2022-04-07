import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { CategoriesListDto } from '#server/common/dto/categories-list.dto';

export class DeleteCategoryOperationResult extends CategoriesListDto {
}

export const deleteCategoryOperation: AsyncThunkPayloadCreator<DeleteCategoryOperationResult, number, { rejectValue: SerializedAxiosError }> =
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete<DeleteCategoryOperationResult>(`categories/${id}`);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };