export interface BackendResponse<T = never> {
  success: boolean;
  message?: string;
  data?: T;
}
