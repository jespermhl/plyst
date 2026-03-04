export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboarded?: boolean;
      handle?: string;
    };
  }

  interface UserPublicMetadata {
    onboarded?: boolean;
    handle?: string;
  }
}
