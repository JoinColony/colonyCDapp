export const getTransactionHashFromPathName = (pathname: string) =>
  pathname.split('/').pop();
