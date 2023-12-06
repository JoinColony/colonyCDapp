export const createValidationComparableObject = (obj1, obj2) => {
  const result = {};

  Object.keys(obj1).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      result[key] = obj2[key];
    }
  });

  return result;
};
