import { BigNumber } from 'ethers';
import { Record } from 'immutable';

import { type DefaultValues, type RecordToJS } from '~types/index.ts';

export interface GasPricesProps {
  cheaper?: BigNumber;
  cheaperWait?: number;
  faster?: BigNumber;
  fasterWait?: number;
  network?: BigNumber;
  suggested?: BigNumber;
  suggestedWait?: number;
  maxFeePerGas?: BigNumber;
  maxPriorityFeePerGas?: BigNumber;
  /**
   * On xdai the gas price of 1 gwei will always work, so for now, we're setting it manually
   */
  fixed?: BigNumber;
  fixedWait?: number;
  timestamp?: number;
}

const defaultValues: DefaultValues<GasPricesProps> = {
  cheaper: undefined,
  cheaperWait: undefined,
  faster: undefined,
  fasterWait: undefined,
  network: undefined,
  suggested: undefined,
  suggestedWait: undefined,
  maxFeePerGas: undefined,
  maxPriorityFeePerGas: undefined,
  /**
   * 1 Gwei converted into wei
   */
  fixed: BigNumber.from('1000000000'),
  fixedWait: 5,
  timestamp: undefined,
};

export class GasPricesRecord
  extends Record<GasPricesProps>(defaultValues)
  implements RecordToJS<GasPricesProps> {}

export const GasPrices = (p?: GasPricesProps) => new GasPricesRecord(p);
