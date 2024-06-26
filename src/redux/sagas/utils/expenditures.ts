import { type AnyColonyClient, ClientType } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { fork } from 'redux-saga/effects';

import { ContextModule, getContext } from '~context/index.ts';
import {
  CreateExpenditureMetadataDocument,
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
import { type MethodParams } from '~types/transactions.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { calculateFee, getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import {
  createTransaction,
  createTransactionChannels,
  waitForTxResult,
} from '../transactions/index.ts';

import { initiateTransaction, takeFrom } from './effects.ts';

const MAX_CLAIM_DELAY_VALUE = BigNumber.from(2).pow(128).sub(1);

/**
 * Util returning a map between token addresses and arrays of payouts field values
 */
const groupExpenditurePayoutsByTokenAddresses = (
  payouts: ExpenditurePayoutFieldValue[],
): Map<string, ExpenditurePayoutFieldValue[]> => {
  const payoutsByTokenAddresses = new Map<
    string,
    ExpenditurePayoutFieldValue[]
  >();
  payouts.forEach((payout) => {
    const currentTokenPayouts =
      payoutsByTokenAddresses.get(payout.tokenAddress) ?? [];
    payoutsByTokenAddresses.set(payout.tokenAddress, [
      ...currentTokenPayouts,
      payout,
    ]);
  });

  return payoutsByTokenAddresses;
};

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

export const getSetExpenditureValuesFunctionParams = ({
  nativeExpenditureId,
  payouts,
  networkInverseFee,
  isStaged,
}: {
  nativeExpenditureId: number;
  payouts: ExpenditurePayoutFieldValue[];
  networkInverseFee: string;
  isStaged?: boolean;
}): MethodParams => {
  // Group payouts by token addresses
  const payoutsByTokenAddresses =
    groupExpenditurePayoutsByTokenAddresses(payouts);

  return [
    nativeExpenditureId,
    // slot ids for recipients
    payouts.map((payout) => payout.slotId ?? 0),
    // recipient addresses
    payouts.map((payout) => payout.recipientAddress),
    // slot ids for skill ids
    [],
    // skill ids
    [],
    // slot ids for claim delays
    payouts.map((payout) => payout.slotId ?? 0),
    // claim delays
    payouts.map((payout) =>
      isStaged ? MAX_CLAIM_DELAY_VALUE : payout.claimDelay,
    ),
    // slot ids for payout modifiers
    [],
    // payout modifiers
    [],
    // token addresses
    [...payoutsByTokenAddresses.keys()],
    // 2-dimensional array mapping token addresses to slot ids
    [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
      payoutsByTokenAddress.map((payout) => payout.slotId ?? 0),
    ),
    // 2-dimensional array mapping token addresses to amounts
    [...payoutsByTokenAddresses.values()].map((payoutsByTokenAddress) =>
      payoutsByTokenAddress.map((payout) =>
        getPayoutAmount(payout, networkInverseFee),
      ),
    ),
  ];
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
  stakeAmount?: string;
}

export function* saveExpenditureMetadata({
  colonyAddress,
  expenditureId,
  fundFromDomainId,
  stages,
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
          isReleased: false,
        })),
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
