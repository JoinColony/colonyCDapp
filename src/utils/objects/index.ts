export const excludeTypenameKey = (
  objectWithTypename?: null | (object & { __typename?: string }),
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __typename, ...newObject } = objectWithTypename || {};
  return newObject;
};
