import { StringSchema as StringSchemaOriginal, TestOptionsMessage } from 'yup';

declare module 'yup' {
  interface StringSchema<T> {
    address(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hexString(message?: TestOptionsMessage): StringSchemaOriginal<T>;
    hasHexPrefix(message?: TestOptionsMessage): StringSchemaOriginal<T>;
  }
  interface NotRequiredArraySchema<T, C = object> {
    unique<TValue = T>(
      message: TestOptionsMessage,
      mapper?: (item: TValue) => any,
    ): NotRequiredArraySchema<T, C>;

    some<TValue = T>(
      message: TestOptionsMessage,
      mapper?: (item: TValue) => any,
    ): NotRequiredArraySchema<T, C>;
  }
}
