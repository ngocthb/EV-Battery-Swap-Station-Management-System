export class HttpError extends Error {
  status?: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
  }
}

export function toHttpError(e: any, fallback = "Đã có lỗi xảy ra.") {
  const status = e?.response?.status as number | undefined;
  const data = e?.response?.data;
  const serverMsg =
    (typeof data === "string" && data) ||
    data?.message ||
    data?.error ||
    (Array.isArray(data?.errors)
      ? data.errors.map((x: any) => x?.message ?? x).join(", ")
      : undefined);

  return new HttpError(serverMsg || e?.message || fallback, status, data);
}
