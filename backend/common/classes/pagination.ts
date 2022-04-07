export class AppPaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export class AppPagination<T> {
  items: T[];
  meta: AppPaginationMeta;
}
