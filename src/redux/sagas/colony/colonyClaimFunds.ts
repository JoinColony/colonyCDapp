import { ClientType } from '@colony/colony-js';
import { type CustomContract } from '@colony/sdk';
import { all, fork, put, takeEvery } from 'redux-saga/effects';

import { DEFAULT_NETWORK_INFO } from '~constants';
import { colonyFundingAbi } from '~constants/abis.ts';
import { ActionTypes } from '~redux/actionTypes.ts';
import { type AllActions, type Action } from '~redux/types/actions/index.ts';
import { TRANSACTION_METHODS } from '~types/transactions.ts';

import {
  type ChannelDefinition,
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
  type TransactionChannelMap,
} from '../transactions/index.ts';
import {
  getColonyManager,
  initiateTransaction,
  putError,
  takeFrom,
} from '../utils/index.ts';

function* colonyClaimFunds({
  payload: { colonyAddress, tokenAddressesGroupedByChain },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.CLAIM_TOKENS_ON_CHAINS>) {
  const txChannels: TransactionChannelMap = {};

  const batchKey = TRANSACTION_METHODS.ClaimColonyFunds;

  const { claimFundsMulticall }: Record<string, ChannelDefinition> =
    yield createTransactionChannels(metaId, ['claimFundsMulticall']);

  const allUniqueTokenAddresses = [
    ...new Set(
      tokenAddressesGroupedByChain.flatMap((group) => group.tokenAddresses),
    ),
  ];

  try {
    const colonyManager = yield getColonyManager();

    const colonyFundingContract: CustomContract<typeof colonyFundingAbi> =
      colonyManager.getCustomContract(colonyAddress, colonyFundingAbi);

    const encodedTransactions = yield all(
      tokenAddressesGroupedByChain.flatMap((group) => {
        const { chainId, tokenAddresses } = group;
        const uniqueTokenAddresses = [...new Set(tokenAddresses)];

        const isOnMainChain =
          !chainId || chainId === DEFAULT_NETWORK_INFO.chainId;

        if (isOnMainChain) {
          return uniqueTokenAddresses.map((tokenAddress) =>
            colonyFundingContract
              // This is necessary because there are multiple claimColonyFunds functions with different signatures
              // and the custom contract cannot determine which one to choose.
              .createTxCreator('claimColonyFunds(address)' as any, [
                tokenAddress,
              ])
              .tx()
              .encode(),
          );
        }

        return uniqueTokenAddresses.map((tokenAddress) =>
          colonyFundingContract
            // This is necessary because there are multiple claimColonyFunds functions with different signatures
            // and the custom contract cannot determine which one to choose.
            .createTxCreator('claimColonyFunds(uint256,address)' as any, [
              BigInt(chainId),
              tokenAddress,
            ])
            .tx()
            .encode(),
        );
      }),
    );

    yield fork(createTransaction, claimFundsMulticall.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: meta.id,
        index: 0,
      },
      ready: false,
      params: [encodedTransactions],
    });

    yield takeFrom(
      claimFundsMulticall.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield initiateTransaction(claimFundsMulticall.id);

    const {
      payload: {
        receipt: { transactionHash: txHash },
      },
    } = yield waitForTxResult(claimFundsMulticall.channel);

    // eslint-disable-next-line no-console
    console.log('Claim funds multi call txHash', txHash);

    yield put<AllActions>({
      type: ActionTypes.CLAIM_TOKENS_ON_CHAINS_SUCCESS,
      payload: { params: { tokenAddresses: allUniqueTokenAddresses } },
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.CLAIM_TOKENS_ON_CHAINS_ERROR,
      error,
      meta,
    );
  } finally {
    for (const { channel: txChannel } of Object.values(txChannels)) {
      txChannel.close();
    }
  }
  return null;
}

export default function* colonyClaimFundsSagas() {
  yield takeEvery(ActionTypes.CLAIM_TOKENS_ON_CHAINS, colonyClaimFunds);
}
