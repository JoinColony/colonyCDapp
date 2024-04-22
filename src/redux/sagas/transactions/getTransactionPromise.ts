import { type ContractClient } from '@colony/colony-js';
import { type TransactionResponse } from '@ethersproject/providers';
import { type Overrides } from 'ethers';

import { type TransactionRecord } from '../../immutable/index.ts';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getTransactionPromise(
  // @TODO this is not great but I feel like we will replace this anyways at some point
  client: ContractClient & { clientType: string },
  tx: TransactionRecord,
): Promise<TransactionResponse> {
  const {
    methodName,
    options: {
      gasLimit: gasLimitOverride,
      gasPrice: gasPriceOverride,
      ...restOptions
    },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions: Overrides = {
    gasLimit: gasLimitOverride || gasLimit,
    gasPrice: gasPriceOverride || gasPrice,
    ...restOptions,
  };

  console.info('TX DEBUG', {
    client: client?.clientType || 'unknownContractClient',
    methodName,
    params,
    overrides: sendOptions,
  });

  return client[methodName](...[...params, sendOptions]);
}

export default getTransactionPromise;
