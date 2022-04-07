import { AxiosError } from 'axios';
import { SerializedError } from '@reduxjs/toolkit';
import { Expose } from 'class-transformer';
import { BackendErrorDto } from '#server/common/dto/backend-error.dto';

export class SerializedAxiosError implements SerializedError {
  @Expose()
  code?: string;

  @Expose()
  message?: string;

  @Expose()
  name?: string;

  @Expose()
  stack?: string;

  constructor(axiosError: AxiosError) {
    // this.stack = axiosError.stack;
    this.name = axiosError.name;
    this.code = undefined;
    this.message = axiosError.message;

    if (axiosError.response) {
      const backendError: BackendErrorDto = axiosError.response.data;

      this.code = backendError.statusCode + ``;
      this.name = backendError.error ?? this.name;
      this.message = backendError.message;
    }

  }
}