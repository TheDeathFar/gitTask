import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { ChangePasswordDto } from '#server/common/dto/change-password.dto';

export type ChangePasswordOperationResult = boolean;

export const changePasswordOperation: AsyncThunkPayloadCreator<ChangePasswordOperationResult, ChangePasswordDto, { rejectValue: SerializedAxiosError }> =
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put<ChangePasswordOperationResult>(`user/change_password`, payload);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };