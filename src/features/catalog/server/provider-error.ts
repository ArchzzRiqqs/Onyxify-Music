export type ProviderErrorCode =
  "timeout" | "http" | "invalid_response" | "configuration" | "unknown";

export class ProviderError extends Error {
  constructor(
    public readonly code: ProviderErrorCode,
    message: string,
    public readonly status = 502,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ProviderError";
  }
}
