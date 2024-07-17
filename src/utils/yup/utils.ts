import { type MixedSchema, mixed } from 'yup';

export const createValidationComparableObject = (obj1, obj2) => {
  const result = {};

  Object.keys(obj1).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      result[key] = obj2[key];
    }
  });

  return result;
};

export const getEnumYupSchema = <T extends string | number>(
  enumObject: Record<string, T>,
): MixedSchema<T> => mixed<T>().oneOf(Object.values(enumObject) as T[]);
