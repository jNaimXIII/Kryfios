export interface MALApiResponse<T> {
  data: T;
  meta?: {
    error?: boolean;
    messages?: {
      error?: string;
    };
  };
}
