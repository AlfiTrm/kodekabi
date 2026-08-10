export type ApiStatus = {
  code: number;
  isSuccess: boolean;
};

export type ApiEnvelope<TData> = {
  status: ApiStatus;
  message: string;
  data: TData;
};

export function isApiEnvelope<TData>(value: unknown): value is ApiEnvelope<TData> {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<ApiEnvelope<TData>>;
  return Boolean(candidate.status && typeof candidate.status.code === "number" && typeof candidate.status.isSuccess === "boolean" && "data" in candidate);
}
