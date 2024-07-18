import { type AnyColonyClient, ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { fork } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateExpenditureMetadataDocument,
  type SplitPaymentDistributionType,
  type CreateExpenditureMetadataMutation,
  type CreateExpenditureMetadataMutationVariables,
} from '~gql';
import { ActionTypes } from '~redux/index.ts';
import { type Address } from '~types';
import {
  type ExpenditurePayoutWithSlotId,
  type ExpenditurePayoutFieldValue,
  type ExpenditureStageFieldValue,
} from '~types/expenditures.ts';
import { type Expenditure } from '~types/graphql.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { calculateFee, getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';

import { initiateTransaction, takeFrom } from './effects.ts';

export const getPayoutAmount = (
  payout: ExpenditurePayoutFieldValue,
  networkInverseFee: string,
) => {
  const { totalToPay } = calculateFee(
    payout.amount,
    networkInverseFee,
    getTokenDecimalsWithFallback(payout.tokenDecimals),
  );

  return totalToPay;
};

export const getExpenditureBalancesByTokenAddress = (
  expenditure: Expenditure,
) => {
  const balancesByTokenAddresses = new Map<string, BigNumber>();
  expenditure.slots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      if (payout.amount === '0') {
        return;
      }

      const currentBalance =
        balancesByTokenAddresses.get(payout.tokenAddress) ?? '0';
      const updatedBalance = BigNumber.from(currentBalance)
        .add(payout.amount)
        .add(payout.networkFee ?? '0');

      balancesByTokenAddresses.set(payout.tokenAddress, updatedBalance);
    });
  });

  return balancesByTokenAddresses;
};

interface SaveExpenditureMetadataParams {
  colonyAddress: string;
  expenditureId: number;
  fundFromDomainId: number;
  stages?: ExpenditureStageFieldValue[];
  distributionType?: SplitPaymentDistributionType;
}

export function* saveExpenditureMetadata({
  colonyAddress,
  expenditureId,
  fundFromDomainId,
  stages,
  distributionType,
}: SaveExpenditureMetadataParams) {
  const apolloClient = getContext(ContextModule.ApolloClient);

  yield apolloClient.mutate<
    CreateExpenditureMetadataMutation,
    CreateExpenditureMetadataMutationVariables
  >({
    mutation: CreateExpenditureMetadataDocument,
    variables: {
      input: {
        id: getExpenditureDatabaseId(colonyAddress, expenditureId),
        fundFromDomainNativeId: fundFromDomainId,
        stages: stages?.map((stage, index) => ({
          name: stage.name,
          slotId: index + 1,
        })),
        distributionType,
      },
    },
  });
}

export const getPayoutsWithSlotIds = (
  payouts: ExpenditurePayoutFieldValue[],
) => {
  return payouts.map((payout, index) => ({
    ...payout,
    slotId: index + 1,
  }));
};

interface ClaimExpendituresPayoutsParams {
  colonyAddress: Address;
  nativeExpenditureId: number;
  claimablePayouts: ExpenditurePayoutWithSlotId[];
  metaId: string;
  colonyClient: AnyColonyClient;
}

// NOTE: this is called from 3 sagas so it's designed to be wrapped in a try catch
export function* claimExpenditurePayouts({
  colonyAddress,
  claimablePayouts,
  nativeExpenditureId,
  metaId,
  colonyClient,
}: ClaimExpendituresPayoutsParams) {
  if (claimablePayouts.length === 0) {
    return;
  }

  const batchKey = 'claimExpenditurePayouts';

  const { claimPayouts } = yield createTransactionChannels(metaId, [
    'claimPayouts',
  ]);

  try {
    const multicallData = claimablePayouts.map((payout) =>
      colonyClient.interface.encodeFunctionData('claimExpenditurePayout', [
        nativeExpenditureId,
        payout.slotId,
        payout.tokenAddress,
      ]),
    );

    yield fork(createTransaction, claimPayouts.id, {
      context: ClientType.ColonyClient,
      methodName: 'multicall',
      identifier: colonyAddress,
      params: [multicallData],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    yield takeFrom(claimPayouts.channel, ActionTypes.TRANSACTION_CREATED);

    yield initiateTransaction({ id: claimPayouts.id });
    yield waitForTxResult(claimPayouts.channel);
  } finally {
    claimPayouts.channel.close();
  }
}

/**
 * @NOTE: Resolving payouts means making sure that for every slot, there's only one payout with non-zero amount.
 * This is to meet the UI requirement that there should be one payout per row.
 */
export const getResolvedPayouts = (
  payouts: ExpenditurePayoutFieldValue[],
  expenditure: Expenditure,
) => {
  const resolvedPayouts: ExpenditurePayoutFieldValue[] = [];

  const payoutsWithSlotIds = getPayoutsWithSlotIds(payouts);

  payoutsWithSlotIds.forEach((payout) => {
    // Add payout as specified in the form
    resolvedPayouts.push(payout);

    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === payout.slotId,
    );

    // Set the amounts for any existing payouts in different tokens to 0
    resolvedPayouts.push(
      ...(existingSlot?.payouts
        ?.filter(
          (slotPayout) =>
            slotPayout.tokenAddress !== payout.tokenAddress &&
            BigNumber.from(slotPayout.amount).gt(0),
        )
        .map((slotPayout) => ({
          slotId: payout.slotId,
          recipientAddress: payout.recipientAddress,
          tokenAddress: slotPayout.tokenAddress,
          amount: '0',
          claimDelay: payout.claimDelay,
        })) ?? []),
    );
  });

  // If there are now less payouts than expenditure slots, we need to remove them by setting their amounts to 0
  const remainingSlots = expenditure.slots.slice(payouts.length);
  remainingSlots.forEach((slot) => {
    slot.payouts?.forEach((payout) => {
      resolvedPayouts.push({
        slotId: slot.id,
        recipientAddress: slot.recipientAddress ?? '',
        tokenAddress: payout.tokenAddress,
        amount: '0',
        claimDelay: slot.claimDelay ?? '0',
      });
    });
  });

  return resolvedPayouts;
};
