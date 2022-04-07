import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { CatalogueDto } from '#server/common/dto/catalogue.dto';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';

export class LoadRecommendationsOperationResult extends CatalogueDto {
}

interface Meta {
  page: number;
}

export const loadRecommendationsOperation: AsyncThunkPayloadCreator<LoadRecommendationsOperationResult, PaginationRequestDto, {
  rejectValue: SerializedAxiosError,
  fulfilledMeta: Meta,
}> =
  async (props, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await axiosInstance.get<LoadRecommendationsOperationResult>(`catalogue/recommendations`, {
        params: props,
      });
      return fulfillWithValue(res.data, { page: props.page });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };