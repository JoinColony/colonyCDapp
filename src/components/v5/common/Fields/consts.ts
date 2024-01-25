export enum FIELD_STATE {
  Error = 'error',
  Warning = 'warning',
}
export type FieldState = (typeof FIELD_STATE)[keyof typeof FIELD_STATE];
