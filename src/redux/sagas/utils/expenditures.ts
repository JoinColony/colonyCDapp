import { BigNumber } from 'ethers';

import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { MethodParams } from '~types';

/**
 * Util returning a map between token addresses and arrays of payouts field values
 */
const groupExpenditurePayoutsByTokenAddresses = (
  payouts: ExpenditurePayoutFieldValue[],
) => {
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

export const getSetExpenditureValuesFunctionParams = (
  nativeExpenditureId: number,
  payouts: ExpenditurePayoutFieldValue[],
): MethodParams => {
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
    payouts.map((payout) => payout.claimDelay),
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
        BigNumber.from(payout.amount).mul(
          // @TODO: This should get the token decimals of the selected token
          BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
        ),
      ),
    ),
  ];
};
