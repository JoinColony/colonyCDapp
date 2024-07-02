import { type TokenStatus } from '~v5/common/types.ts';

export interface TokenCellProps {
  tokenAddress: string;
  status: TokenStatus;
  isSymbolCell?: boolean;
}
