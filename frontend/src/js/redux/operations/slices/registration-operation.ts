import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { JwtDto } from '#server/common/dto/jwt.dto';

export class RegistrationOperationResult extends JwtDto {}

export const registrationOperation: AsyncThunkPayloadCreator<RegistrationOperationResult, {
  data: CreateUserDto,
  photo?: File
}, { rejectValue: SerializedAxiosError }> = async ({
                                                     data,
                                                     photo = null,
                                                   }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    Object.entries(data).map(([key, value]) => {
      formData.append(key, value);
    });
    formData.append(`photo`, photo);
    const res = await axiosInstance.post<RegistrationOperationResult>(`auth/register`, formData, {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
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