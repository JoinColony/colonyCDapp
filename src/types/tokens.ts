import { BigNumber } from 'ethers';
import { Token } from '~types';

export interface UserTokenBalanceData {
  nativeToken: Token;
  inactiveBalance: BigNumber;
  lockedBalance: BigNumber;
  activeBalance: BigNumber;
  totalBalance: BigNumber;
  isPendingBalanceZero: boolean;
}
