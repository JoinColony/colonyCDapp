export const shortErrorMessage = (message: string) => {
  return message.length > 120 ? `${message.substring(0, 117)}...` : message;
};
