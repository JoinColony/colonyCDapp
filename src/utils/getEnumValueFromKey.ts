export const getEnumValueFromKey = <TEnum extends object>(
  enumObject: TEnum,
  key: string | number | undefined,
  defaultEnumValue?: TEnum[keyof TEnum],
): TEnum[keyof TEnum] => {
  if (key === undefined) {
    if (!defaultEnumValue) {
      throw new Error('Could not find enum entry for undefined key');
    }

    return defaultEnumValue;
  }
  const enumEntry = enumObject[key];

  if (enumEntry === undefined) {
    if (!defaultEnumValue) {
      throw new Error(`Could not find enum entry for key "${key}"`);
    }

    return defaultEnumValue;
  }

  return enumEntry;
};
