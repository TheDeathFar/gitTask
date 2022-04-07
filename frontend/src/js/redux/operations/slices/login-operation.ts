import axiosInstance from '#src/js/axios/axios-instance';
import { LoginUserDto } from '#server/common/dto/login-user.dto';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { JwtDto } from '#server/common/dto/jwt.dto';

export class LoginOperationResult extends JwtDto {
}

export const loginOperation: AsyncThunkPayloadCreator<LoginOperationResult, LoginUserDto, { rejectValue: SerializedAxiosError }> =
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<LoginOperationResult>(`auth/login`, payload);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };