import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';

interface Meta {
  id: number;
}

export const deleteCatalogueItemOperation: AsyncThunkPayloadCreator<boolean, number, {
  rejectValue: SerializedAxiosError,
  fulfilledMeta: Meta,
}> =
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const res = await axiosInstance.delete<boolean>(`catalogue/item/${id}`);
      return fulfillWithValue(res.data, { id });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };