type ApiResponse<TData, TError> = {
  data: TData;
  error: TError;
};

type SortDirection = "ASC" | "DESC";

type PaginatedResponse<TData> = {
  items_per_page: number;
  items_total: number;
  page_number: number;
  page_total: number;
  data: [] | TData[];
};

type DeletedResponse = {
  acknowledged: true;
  deletedCount: number;
};

export { ApiResponse, PaginatedResponse, DeletedResponse, SortDirection };
