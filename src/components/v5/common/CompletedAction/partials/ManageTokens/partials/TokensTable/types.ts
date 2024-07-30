import { type TokenStatus } from '~v5/common/types.ts';

export interface TokensTableModel {
  tokenAddress: string;
  status: TokenStatus;
}
