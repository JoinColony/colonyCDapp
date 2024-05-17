import {
  type AnyColonyClient,
  ColonyRole,
  getPermissionProofs,
} from '@colony/colony-js';
import { type BigNumberish, utils, BigNumber } from 'ethers';

import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { type Expenditure } from '~types/graphql.ts';

import { getPayoutAmount } from './expenditures.ts';

export const toB32 = (input: BigNumberish) =>
  utils.hexZeroPad(utils.hexlify(input), 32);

/**
 * Indexes of relevant data slots in network contracts
 * See: https://github.com/JoinColony/colonyNetwork/blob/develop/contracts/colony/ColonyStorage.sol
 */
const EXPENDITURESLOTS_SLOT = toB32(BigNumber.from(26));

const EXPENDITURESLOT_RECIPIENT = toB32(BigNumber.from(0));
const EXPENDITURESLOT_CLAIMDELAY = toB32(BigNumber.from(1));

/**
 * Helper function returning an array of encoded multicall data containing transactions
 * needed to update expenditure payouts
 */
export const getMulticallDataForUpdatedPayouts = async ({
  expenditure,
  payouts,
  colonyClient,
  networkInverseFee,
}: {
  expenditure: Expenditure;
  payouts: ExpenditurePayoutFieldValue[];
  colonyClient: AnyColonyClient;
  networkInverseFee: string;
}) => {
  const [permissionDomainId, childSkillIndex] = await getPermissionProofs(
    colonyClient.networkClient,
    colonyClient,
    expenditure.nativeDomainId,
    ColonyRole.Administration,
  );

  const encodedMulticallData: string[] = [];

  payouts.forEach((payout) => {
    const existingSlot = expenditure.slots.find(
      (slot) => slot.id === payout.slotId,
    );

    // Set recipient
    if (
      !existingSlot ||
      existingSlot.recipientAddress !== payout.recipientAddress
    ) {
      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData('setExpenditureState', [
          permissionDomainId,
          childSkillIndex,
          expenditure.nativeId,
          EXPENDITURESLOTS_SLOT,
          [false, true],
          [toB32(payout.slotId ?? ''), EXPENDITURESLOT_RECIPIENT],
          toB32(payout.recipientAddress),
        ]),
      );
    }

    // Set claim delay
    if (!existingSlot || existingSlot.claimDelay !== payout.claimDelay) {
      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData('setExpenditureState', [
          permissionDomainId,
          childSkillIndex,
          expenditure.nativeId,
          EXPENDITURESLOTS_SLOT,
          [false, true],
          [toB32(payout.slotId ?? ''), EXPENDITURESLOT_CLAIMDELAY],
          toB32(BigNumber.from(payout.claimDelay)),
        ]),
      );
    }

    // Set token address and amount
    const amountWithFee = getPayoutAmount(payout, networkInverseFee);
    const existingPayout = existingSlot?.payouts?.find(
      (slotPayout) =>
        BigNumber.from(slotPayout.amount)
          .add(slotPayout.networkFee ?? '0')
          .eq(amountWithFee) && slotPayout.tokenAddress === payout.tokenAddress,
    );
    if (!existingPayout) {
      encodedMulticallData.push(
        colonyClient.interface.encodeFunctionData(
          'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)',
          [
            permissionDomainId,
            childSkillIndex,
            expenditure.nativeId,
            payout.slotId ?? '',
            payout.tokenAddress,
            amountWithFee,
          ],
        ),
      );
    }
  });

  return encodedMulticallData;
};
