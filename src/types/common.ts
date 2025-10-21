export type ResponseWith<Key extends string, T> = {
  success: boolean;
  message?: string;
} & {
  [K in Key]: T;
};

export type PaginatedResponse<Key extends string, T> ={
  success: boolean;
  totalPages: number;
  currentPage: number;
} &{
   [key in Key]: T[];
}

export type ResponseWithData<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type PaginatedResponseData<T>={
  success : boolean;
  totalPages:number;
  currentPage:number;
  data:T[];
}

