import { TransactionResponse } from '@ethersproject/providers';
import { Overrides } from 'ethers';
import { ContractClient } from '@colony/colony-js';
import { TransactionRecord } from '../../immutable';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getTransactionPromise(
  // @TODO this is not great but I feel like we will replace this anyways at some point
  client: ContractClient,
  tx: TransactionRecord,
): Promise<TransactionResponse> {
  const {
    methodName,
    options: { gasLimit: gasLimitOverride, gasPrice: gasPriceOverride, ...restOptions },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions: Overrides = {
    gasLimit: gasLimitOverride || gasLimit,
    gasPrice: gasPriceOverride || gasPrice,
    ...restOptions,
  };
  return client[methodName](...[...params, sendOptions]);
}

export default getTransactionPromise;
