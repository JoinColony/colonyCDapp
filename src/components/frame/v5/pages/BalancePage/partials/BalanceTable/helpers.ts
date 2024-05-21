export const formattedTokenSymbol = (tokenSymbol?: string) => {
  if (tokenSymbol) {
    return tokenSymbol.length > 5
      ? `${tokenSymbol.slice(0, 5)}...`
      : tokenSymbol;
  }

  return tokenSymbol;
};
