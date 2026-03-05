export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: Record<string, unknown>;
  }

  type UserPublicMetadata = Record<string, unknown>;
}
