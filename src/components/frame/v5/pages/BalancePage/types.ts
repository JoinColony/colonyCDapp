import { ColonyBalancesFragment, NativeTokenStatus, TokenFragment } from '~gql';

export interface BalanceList {
  token: TokenFragment;
  balance: string;
}

export interface BalaceTableProps {
  data: BalanceList[];
  isSorted?: boolean;
  onBalanceSort: () => void;
}

export interface TableItemProps extends Pick<BalanceList, 'token'> {
  isTokenNative: boolean;
  nativeTokenStatus: NativeTokenStatus;
  balances: ColonyBalancesFragment;
  domainId?: number;
}

export interface TableHeadProps extends Pick<BalaceTableProps, 'isSorted'> {
  onClick: () => void;
}
