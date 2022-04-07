import axiosInstance from '#src/js/axios/axios-instance';
import axios from 'axios';
import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { classToPlain } from 'class-transformer';
import { EditItemDto } from '#server/common/dto/edit-item.dto';
import { Operations } from '#redux/operations/operations';
import { BasketActions } from '#redux/reducers/slices/basket-slice';
import { ItemDto } from '#server/common/dto/item.dto';

export class EditItemOperationResult extends ItemDto {
}

export const editItemOperation: AsyncThunkPayloadCreator<EditItemOperationResult, EditItemDto, { rejectValue: SerializedAxiosError }> =
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosInstance.patch<EditItemOperationResult>(`item/${payload.id}`, payload);

      // Обновим информацию и в списке предметов
      dispatch(Operations.resetUserItems());
      // В списке трейдофферов
      dispatch(Operations.resetUserTrades());
      // А так же в корзине
      dispatch(BasketActions.update(res.data));

      return res.data;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return rejectWithValue(classToPlain(new SerializedAxiosError(e)));
      } else {
        return rejectWithValue(e);
      }
    }
  };