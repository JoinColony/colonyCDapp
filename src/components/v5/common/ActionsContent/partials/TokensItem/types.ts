import { TokenProps } from '../TokensTable/types';

export interface TokensItemProps {
  token: {
    tokenAddress: string;
    symbol: string;
    name: string;
    decimals: number;
    isTokenNative?: boolean;
  };
  id: string;
  onRemoveClick: (tokenAddress: string) => void;
  onUpdate: (tokenAddress: string, values: TokenProps) => void;
}
