import { type OptionalValue } from '~types';

export const excludeTypenameKey = <T>(
  objectWithTypename: T & { __typename?: string },
) => {
  if (!objectWithTypename) {
    return objectWithTypename;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...objectWithoutTypename } = objectWithTypename;
  return objectWithoutTypename;
};

export const getProperty = <T>(obj: T, key: string, defaultValue?: any) => {
  return typeof obj === 'object' && obj && key in obj ? obj[key] : defaultValue;
};

export const getObjectKeys = <T extends object>(obj: T): Array<keyof T> => {
  return Object.keys(obj) as Array<keyof T>;
};

export const getObjectValues = <T extends object>(
  obj: T,
): Array<T[keyof T]> => {
  return Object.values(obj) as Array<T[keyof T]>;
};

/**
 * Removes specified fields from an object and returns the updated object.
 *
 * @param {OptionalValue<T>} obj - The object to modify. Returns `null` if this is `null` or `undefined`.
 * @param {K[]} fields - The fields to remove from the object.
 *
 * @example
 * removeObjectFields({ a: 1, b: 2 }, ['b']); // { a: 1 }
 */
export const removeObjectFields = <
  T extends Record<string, any>,
  K extends keyof T,
>(
  obj: OptionalValue<T>,
  fields: K[],
) => {
  if (!obj) {
    return null;
  }

  const rest = { ...obj };

  fields.forEach((field) => {
    delete rest[field];
  });

  return rest as Omit<T, K>;
};
