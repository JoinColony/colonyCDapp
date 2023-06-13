export const calculateLastSliceIndex = (
  max: number,
  items: any[],
  includeLastItem = true,
) => {
  if (!items?.length) {
    return 0;
  }

  if (items.length <= max) {
    return items.length;
  }

  return includeLastItem ? max : max - 1;
};

export const calculateRemainingItems = (
  max: number,
  items: any[],
  includeLastItem = true,
) => {
  if (!items?.length) {
    return 0;
  }

  if (items.length <= max) {
    return 0;
  }
  return items.length - (includeLastItem ? max : max - 1);
};
