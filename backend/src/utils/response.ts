// src/utils/response.ts

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function fail(error: string): ApiResponse<null> {
  return { success: false, error };
}
