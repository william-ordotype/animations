type ApiResponse<TData, TError> = {
  data: TData;
  error: TError;
};

type PaginatedResponse<TData> = {
  items_per_page: number;
  items_total: number;
  page_number: number;
  page_total: number;
  data: TData[];
};

export { ApiResponse, PaginatedResponse };
