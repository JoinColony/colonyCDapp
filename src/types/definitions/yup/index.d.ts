import { StringSchema as StringSchemaOriginal, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface StringSchema<T> {
    address(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    ensAddress(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hexString(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hasHexPrefix(message?: TestOptionsMessage): StringSchemaOriginal<T>;
  }
}
