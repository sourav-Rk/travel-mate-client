export interface BackendResponse<T = never> {
  success: boolean;
  message?: string;
  data?: T;
}


export interface ApiError {
  message?: string
  response?: {
    data?: {
      message?: string
      error?: string
      code?: string | number
      details?: unknown
    }
    status?: number
    statusText?: string
  }
  config?: {
    url?: string
    method?: string
  }
}