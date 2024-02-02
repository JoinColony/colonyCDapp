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
