import {
  ColonyBalancesFragment,
  NativeTokenStatus,
  TokenFragment,
  TokenType,
} from '~gql';

export interface TableItemProps {
  token: TokenFragment;
  isTokenNative: boolean;
  nativeTokenStatus: NativeTokenStatus;
  balances: ColonyBalancesFragment;
  domainId?: number;
  onChange: () => void;
}
export interface BalanceTableModel {
  key: string;
  asset: string;
  symbol: string;
  type: TokenType;
  balance: string;
  decimals: number;
  isTokenNative: boolean;
}
