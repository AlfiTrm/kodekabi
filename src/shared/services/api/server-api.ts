import "server-only";

import { serverEnv } from "@/src/shared/config/server-env";
import { ApiError } from "./api-error";
import { isApiEnvelope } from "./types";

type ServerApiOptions<TBody> = Omit<RequestInit, "body"> & {
  body?: TBody;
  timeoutMs?: number;
};

type ErrorPayload = {
  code?: string;
  message?: string;
};

export type ServerApiResult<TResponse> = {
  data: TResponse;
  headers: Headers;
  status: number;
};

export async function serverApiWithMeta<TResponse, TBody = never>(path: string, options: ServerApiOptions<TBody> = {}): Promise<ServerApiResult<TResponse>> {
  const { body, headers, timeoutMs = 10_000, ...requestInit } = options;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let response: Response;

  try {
    response = await fetch(`${serverEnv.apiBaseUrl}${normalizedPath}`, {
      ...requestInit,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ApiError("Server terlalu lama merespons. Coba lagi.", 408, "REQUEST_TIMEOUT");
    }

    throw new ApiError("Tidak dapat terhubung ke server.", 503, "NETWORK_ERROR");
  }

  const payload = await response.json().catch(() => null) as unknown;

  if (!response.ok) {
    const errorPayload = payload as ErrorPayload | null;
    throw new ApiError(errorPayload?.message ?? "Permintaan gagal diproses.", response.status, errorPayload?.code);
  }

  if (isApiEnvelope<TResponse>(payload)) {
    if (!payload.status.isSuccess) {
      throw new ApiError(payload.message || "Permintaan gagal diproses.", payload.status.code);
    }

    return { data: payload.data, headers: response.headers, status: response.status };
  }

  return { data: payload as TResponse, headers: response.headers, status: response.status };
}

export async function serverApi<TResponse, TBody = never>(path: string, options: ServerApiOptions<TBody> = {}) {
  const result = await serverApiWithMeta<TResponse, TBody>(path, options);
  return result.data;
}
