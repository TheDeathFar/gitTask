import axiosInstance from '#src/js/axios/axios-instance';
import { JwtDto } from '#server/common/dto/jwt.dto';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';

export class SetPhotoOperationResult extends JwtDto {
}

export const setPhotoOperation: AsyncThunkPayloadCreator<SetPhotoOperationResult, File, { rejectValue: SerializedAxiosError }> =
  async (photo, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.set(`photo`, photo);
      const res = await axiosInstance.put<SetPhotoOperationResult>(`user/set_photo`, formData);
      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };