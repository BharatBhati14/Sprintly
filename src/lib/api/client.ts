import { ApiError } from "./errors";

interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  user?: T;
}

interface ApiFailureResponse {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export async function apiClient<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
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
    return successBody.data;
  }

  if ("user" in successBody && successBody.user !== undefined) {
    return successBody.user;
  }

  return undefined as T;
}
