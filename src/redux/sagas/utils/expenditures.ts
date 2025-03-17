import { type AnyColonyClient, type Network, Tokens } from '@colony/colony-js';
import { BigNumber } from 'ethers';
import { getAddress, isAddress } from 'ethers/lib/utils';

import { apolloClient } from '~apollo';
import { mutateWithAuthRetry } from '~apollo/utils.ts';
import { DEV_USDC_ADDRESS, isDev } from '~constants';
import {
  CreateExpenditureMetadataDocument,
  type GetUserByAddressQuery,
  type SplitPaymentDistributionType,
  type CreateExpenditureMetadataMutation,
  type CreateExpenditureMetadataMutationVariables,
  type GetUserByAddressQueryVariables,
  GetUserByAddressDocument,
  type GetUserLiquidationAddressQuery,
  GetUserLiquidationAddressDocument,
  type GetUserLiquidationAddressQueryVariables,
} from '~gql';
import { type Address } from '~types';
import {
  type ExpenditurePayoutWithSlotId,
  type ExpenditurePayoutFieldValue,
  type ExpenditureStageFieldValue,
} from '~types/expenditures.ts';
import { type Expenditure } from '~types/graphql.ts';
import { getExpenditureDatabaseId } from '~utils/databaseId.ts';
import { calculateFee, getTokenDecimalsWithFallback } from '~utils/tokens.ts';

import { chunkedMulticall } from './multicall.ts';

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
  numberOfPayouts: number;
  numberOfTokens: number;
  stages?: ExpenditureStageFieldValue[];
  distributionType?: SplitPaymentDistributionType;
}

export function* saveExpenditureMetadata({
  colonyAddress,
  expenditureId,
  fundFromDomainId,
  stages,
  numberOfPayouts,
  numberOfTokens,
  distributionType,
}: SaveExpenditureMetadataParams) {
  yield mutateWithAuthRetry(() =>
    apolloClient.mutate<
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
          expectedNumberOfPayouts: numberOfPayouts,
          expectedNumberOfTokens: numberOfTokens,
          distributionType,
        },
      },
    }),
  );
}

export const getPayoutsWithSlotIds = (
  payouts: ExpenditurePayoutFieldValue[],
) => {
  return payouts.map((payout, index) => ({
    ...payout,
    slotId: payout.slotId ?? index + 1,
  }));
};

interface ClaimExpendituresPayoutsParams {
  colonyAddress: Address;
  nativeExpenditureId: number;
  claimablePayouts: ExpenditurePayoutWithSlotId[];
  metaId: string;
  colonyClient: AnyColonyClient;
  associatedActionId: string;
}

// NOTE: this is called from 3 sagas so it's designed to be wrapped in a try catch
export function* claimExpenditurePayouts({
  colonyAddress,
  claimablePayouts,
  nativeExpenditureId,
  metaId,
  colonyClient,
  associatedActionId,
}: ClaimExpendituresPayoutsParams) {
  if (claimablePayouts.length === 0) {
    return;
  }

  const {
    createMulticallChannels,
    createMulticallTransactions,
    processMulticallTransactions,
    closeMulticallChannels,
  } = chunkedMulticall({
    colonyAddress,
    items: claimablePayouts,
    // In testing, this multicall would fail with more than 78 payouts
    chunkSize: 78,
    metaId,
    batchKey: 'claimExpenditurePayouts',
    channelId: 'claimPayouts',
    associatedActionId,
  });

  yield createMulticallChannels();

  try {
    yield* createMulticallTransactions();
    yield processMulticallTransactions({
      encodeFunctionData: (payouts: ExpenditurePayoutWithSlotId[]) => {
        const multicallData = payouts.map((payout) =>
          colonyClient.interface.encodeFunctionData('claimExpenditurePayout', [
            nativeExpenditureId,
            payout.slotId,
            payout.tokenAddress,
          ]),
        );

        return multicallData;
      },
    });
  } finally {
    closeMulticallChannels();
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
  if (!payouts.every((payout) => !!payout.slotId)) {
    throw new Error('All payouts must have a slotId');
  }

  if (new Set(payouts.map((payout) => payout.slotId)).size !== payouts.length) {
    throw new Error('Cannot resolve payouts with duplicate slotIds');
  }

  const resolvedPayouts: ExpenditurePayoutFieldValue[] = [];

  // Iterate over existing slots to set the new token/amount and remove any existing payouts in different tokens
  expenditure.slots.forEach((slot) => {
    const existingPayouts = slot.payouts ?? [];

    const payoutToSet = payouts.find((payout) => payout.slotId === slot.id);
    if (payoutToSet) {
      resolvedPayouts.push(payoutToSet);
    }

    // Remove existing payouts by setting their amounts to 0
    resolvedPayouts.push(
      ...(existingPayouts
        ?.filter(
          (existingPayout) =>
            (!payoutToSet ||
              existingPayout.tokenAddress !== payoutToSet.tokenAddress) &&
            BigNumber.from(existingPayout.amount).gt(0),
        )
        .map((slotPayout) => ({
          slotId: slot.id,
          recipientAddress:
            payoutToSet?.recipientAddress ?? slot.recipientAddress ?? '',
          tokenAddress: slotPayout.tokenAddress,
          amount: '0',
          claimDelay: payoutToSet?.claimDelay ?? slot.claimDelay ?? '',
        })) ?? []),
    );
  });

  // Add remaining payouts that were not in the existing slots
  const existingSlotIds = new Set(resolvedPayouts.map((rp) => rp.slotId));
  const payoutsToAdd = payouts.filter(
    (payout) => !existingSlotIds.has(payout.slotId),
  );
  payoutsToAdd.forEach((payout) => {
    resolvedPayouts.push(payout);
  });

  return resolvedPayouts;
};

interface MinimalPayout {
  recipientAddress: string;
  tokenAddress: string;
}

export const adjustRecipientAddress = async (
  { recipientAddress, tokenAddress }: MinimalPayout,
  network: Network,
) => {
  const USDCAddress = isDev ? DEV_USDC_ADDRESS : Tokens[network]?.USDC;

  if (tokenAddress !== USDCAddress) {
    return recipientAddress;
  }

  const { data: userData } = await apolloClient.query<
    GetUserByAddressQuery,
    GetUserByAddressQueryVariables
  >({
    query: GetUserByAddressDocument,
    variables: {
      address: getAddress(recipientAddress),
    },
  });

  const user = userData?.getUserByAddress?.items[0];
  if (!user || !user.profile?.isAutoOfframpEnabled) {
    return recipientAddress;
  }

  const { data: liquidationAddressData } = await apolloClient.query<
    GetUserLiquidationAddressQuery,
    GetUserLiquidationAddressQueryVariables
  >({
    query: GetUserLiquidationAddressDocument,
    variables: {
      userAddress: recipientAddress,
    },
  });
  const liquidationAddress =
    liquidationAddressData?.bridgeGetUserLiquidationAddress;

  if (!liquidationAddress || !isAddress(liquidationAddress)) {
    return recipientAddress;
  }

  return liquidationAddress;
};

export const adjustPayoutsAddresses = async (
  payouts: MinimalPayout[],
  network: Network,
) => {
  return Promise.all(
    payouts.map(async (payout) => {
      const { tokenAddress, recipientAddress } = payout;
      const paymentAddress = await adjustRecipientAddress(
        {
          recipientAddress,
          tokenAddress,
        },
        network,
      );

      return {
        ...payout,
        recipientAddress: paymentAddress,
      };
    }),
  );
};
