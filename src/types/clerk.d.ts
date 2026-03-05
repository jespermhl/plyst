export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: Record<string, unknown>;
  }

  interface UserPublicMetadata {
    [key: string]: unknown;
  }
}
