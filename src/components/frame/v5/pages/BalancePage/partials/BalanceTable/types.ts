import { type BigNumber } from 'ethers';

import { type TokenFragment } from '~gql';

export interface BalanceTableProps {
  data: BalanceTableFieldModel[];
}

export interface BalanceTableFieldModel {
  balance: BigNumber;
  token?: TokenFragment;
}
