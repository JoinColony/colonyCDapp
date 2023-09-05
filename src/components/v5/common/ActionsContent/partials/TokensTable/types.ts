export interface TokenProps {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  isTokenNative?: boolean;
  key: string;
}
