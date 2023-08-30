export const splitWalletAddress = (address: string): string => {
  const firstSix = address.substring(0, 6);
  const lastFour = address.substring(address.length - 4);

  return `${firstSix}...${lastFour}`;
};
