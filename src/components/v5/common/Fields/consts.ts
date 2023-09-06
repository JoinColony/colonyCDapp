export const FIELD_STATE = {
  Error: 'error',
  Warning: 'warning',
} as const;

export type FieldState = (typeof FIELD_STATE)[keyof typeof FIELD_STATE];
