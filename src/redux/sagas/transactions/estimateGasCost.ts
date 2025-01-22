import { ClientType } from '@colony/colony-js';
import { BigNumber, type Contract } from 'ethers';
import { call, put, take } from 'redux-saga/effects';

import {
  transactionUpdateGas,
  transactionEstimateError,
  transactionSend,
  transactionUpdateOptions,
} from '~redux/actionCreators/index.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type Action } from '~redux/types/actions/index.ts';
import { getTransaction } from '~state/transactionState.ts';

import { getGasPrices, getColonyManager } from '../utils/index.ts';

/*
 * @area: including a bit of buffer on the gas sent can be a good thing.
 * Your tx might be applied against a different state from when you
 * estimateGas'd it, which might cause it to still work, but use a bit more gas
 */
// Plus 10%
const SAFE_GAS_LIMIT_MULTIPLIER = BigNumber.from(10);

export default function* estimateGasCost({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_ESTIMATE_GAS>) {
  try {
    // Get the given transaction
    const { context, methodName, identifier, params, gasLimit, options } =
      yield getTransaction(id, 'cache-first');
    const colonyManager = yield getColonyManager();

    let contextClient: Contract;
    if (context === ClientType.TokenClient) {
      contextClient = yield colonyManager.getTokenClient(identifier as string);
    } else {
      contextClient = yield colonyManager.getClient(context, identifier);
    }

    if (!contextClient) {
      throw new Error('Context client failed to instantiate');
    }

    // Estimate the gas limit with the method.
    const estimatedGas = yield contextClient.estimateGas[methodName](
      ...params,
      options,
    );

    const suggestedGasLimit = estimatedGas
      .div(SAFE_GAS_LIMIT_MULTIPLIER)
      .add(estimatedGas);

    const { network, suggested, maxFeePerGas, maxPriorityFeePerGas } =
      yield call(getGasPrices);

    const gasPrice = suggested || network;

    yield put(
      transactionUpdateGas(id, {
        /*
         * @NOTE Prevent a race condition if we're also manually estimating gas
         *
         * In some cases we might want to manually estimate gas (see: finalize motion).
         * In cases like those we fire the TRANSACTION_ESTIMATE_GAS action twice in quick
         * succession which leads to a race condition (basically which ever finishes
         * last will get set)
         *
         * This prevents that by making sure that we preserve any gas limit values that
         * are already set on the transaction (the ones that were set manually) and
         * if not, only then set the suggested value
         */
        gasLimit: gasLimit || suggestedGasLimit.toString(),
        gasPrice,
      }),
    );

    // Wait for gas limit to be updated
    yield take(ActionTypes.TRANSACTION_UPDATED_IN_DB);

    if (maxFeePerGas && maxPriorityFeePerGas) {
      yield put(
        transactionUpdateOptions(id, {
          options: {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        }),
      );

      // wait for transactions options to be updated
      yield take(ActionTypes.TRANSACTION_UPDATED_IN_DB);
    }

    yield put(transactionSend(id));
  } catch (error) {
    console.error(error);
    return yield put(transactionEstimateError(id, error));
  }
  return null;
}
