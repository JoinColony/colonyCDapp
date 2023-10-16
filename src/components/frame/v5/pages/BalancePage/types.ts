import { TokenType } from '~gql';

export interface BalanceTableModel {
  key: string;
  asset: string;
  symbol: string;
  type: TokenType;
  balance: string;
  decimals: number;
}
