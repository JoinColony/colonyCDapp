import { type TokenFragment } from '~gql';

export interface BalanceTableFieldModel {
  balance: string | JSX.Element;
  token?: TokenFragment;
}
