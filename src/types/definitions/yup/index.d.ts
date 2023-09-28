import { StringSchema as StringSchemaOriginal, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface StringSchema<T> {
    address(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hexString(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hasHexPrefix(message?: TestOptionsMessage): StringSchemaOriginal<T>;
  }
  interface BasicArraySchema<T> {
    unique(
      message?: TestOptionsMessage,
      mapper?: (a: Exclude<T, undefined | null>[number]) => any,
    ): ArraySchema<T>;
  }
}
