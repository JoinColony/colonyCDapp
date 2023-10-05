import isSafeInteger from 'lodash/isSafeInteger';

export const getEnumValueFromKey = <TEnum extends object>(
  enumObject: TEnum,
  key: string | number | undefined,
  defaultEnumValue?: TEnum[keyof TEnum],
): TEnum[keyof TEnum] => {
  const enumEntry = Object.entries(enumObject).find(
    ([entryKey, value]) => !isSafeInteger(Number(entryKey)) && value === key,
  );

  if (enumEntry === undefined) {
    if (defaultEnumValue === undefined) {
      throw new Error(`Could not find enum entry for key "${key}"`);
    }

    return defaultEnumValue;
  }

  const [, value] = enumEntry;

  return value;
};
