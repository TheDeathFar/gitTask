import { SerializedAxiosError } from '#src/js/axios/serialized-axios-error';
import { AppPaginationMeta } from '#server/common/classes/pagination';

export interface PaginationResult<T> {
  currentMeta: AppPaginationMeta;
  pages: {
    [page: number]: T
  };
}

export interface PREState<T> {
  pending: boolean;
  result: T;
  error: SerializedAxiosError;
}

export const resetPaginationState = (state: PREState<PaginationResult<any>>): void => {
  state.pending = false;
  state.result = {
    currentMeta: null,
    pages: {},
  };
  state.error = null;
};

export const resetPreState = (state: PREState<any>): void => {
  state.pending = false;
  state.result = null;
  state.error = null;
};