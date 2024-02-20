import { type BigNumber } from 'ethers';

import { type TokenFragment } from '~gql';

export interface BalanceTableFieldModel {
  balance: BigNumber;
  token?: TokenFragment;
}
