export const shortErrorMessage = (message: string) => {
  return `${message.substring(0, 30)}${message.length > 20 ? '...' : ''}`;
};
