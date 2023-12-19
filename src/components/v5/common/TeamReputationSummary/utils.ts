export const formatPercentage = (percentage: string | null | undefined) => {
  if (!percentage) {
    return '0.00%';
  }

  const floatValue = parseFloat(percentage);

  return `${(Math.floor(floatValue * 100) / 100).toFixed(2)}%`;
};
