import { ApiError } from "./errors";

interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  user?: T;
  pagination?: unknown;
}

interface ApiFailureResponse {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

interface ApiClientOptions extends RequestInit {
  includeMeta?: boolean;
}

export interface ApiMeta {
  pagination?: unknown;
}

export function apiClient<T>(
  url: string,
  options?: Omit<ApiClientOptions, "includeMeta"> & {
    includeMeta?: false;
  },
): Promise<T>;

export function apiClient<T>(
  url: string,
  options: ApiClientOptions & {
    includeMeta: true;
  },
): Promise<{
  data: T;
  meta: ApiMeta;
}>;

export async function apiClient<T>(
  url: string,
  options: ApiClientOptions = {},
): Promise<T | { data: T; meta: ApiMeta }> {
  const { includeMeta, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  let body: ApiResponse<T> | null = null;

  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
      response.status,
      "INVALID_RESPONSE",
    );
  }

  if (!response.ok || !body.success) {
    const errorBody = body as ApiFailureResponse;

    throw new ApiError(
      errorBody.error?.message ?? "Something went wrong.",
      response.status,
      errorBody.error?.code!,
    );
  }

  const successBody = body as ApiSuccessResponse<T>;

  if ("data" in successBody && successBody.data !== undefined) {
    if (includeMeta) {
      return {
        data: successBody.data,
        meta: {
          pagination: successBody.pagination,
        },
      };
    }

    return successBody.data;
  }

  if ("user" in successBody && successBody.user !== undefined) {
    return successBody.user;
  }

  return undefined as T;
}
