type CommonResponse<T> = {
  data: T;
};

type PaginatedResponse<T> = {
  items_per_page: number;
  items_total: number;
  page_number: number;
  page_total: number;
  data: T[];
};
