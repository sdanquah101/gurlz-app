// Common API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Auth API types
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}