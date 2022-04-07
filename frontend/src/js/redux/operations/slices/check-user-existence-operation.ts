import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { classToPlain } from 'class-transformer';

export const checkUserExistenceOperation: AsyncThunkPayloadCreator<boolean, string, { rejectValue: SerializedAxiosError }> =
  async (username, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<boolean>(`user/is_user_already_exist/${username}`);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };