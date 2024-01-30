import { type TokenFragment } from '~gql';

export interface BalanceTableProps {
  data: BalanceTableFieldModel[];
}

export interface BalanceTableFieldModel {
  balance: string | JSX.Element;
  token?: TokenFragment;
}
