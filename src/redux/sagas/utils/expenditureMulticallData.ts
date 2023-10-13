import {
  AnyColonyClient,
  ColonyClientV1,
  ColonyClientV2,
  ColonyClientV3,
  ColonyClientV4,
  ColonyClientV5,
  ColonyClientV6,
  ColonyClientV7,
  ColonyClientV8,
  ColonyClientV9,
} from '@colony/colony-js';
import { BigNumber, BigNumberish, utils } from 'ethers';

import { ExpenditurePayoutFieldValue } from '~common/Expenditures/ExpenditureForm';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { Expenditure } from '~types';

const toB32 = (input: BigNumberish) =>
  utils.hexZeroPad(utils.hexlify(input), 32);

const MAPPING = false;
const ARRAY = true;

const EXPENDITURESLOTS_SLOT = BigNumber.from(26);

// struct ExpenditureSlot {
//   address payable recipient;
//   uint256 claimDelay;
//   int256 payoutModifier;
//   uint256[] skills;
// }
const EXPENDITURESLOT_RECIPIENT = toB32(BigNumber.from(0));
const EXPENDITURESLOT_CLAIMDELAY = toB32(BigNumber.from(1));

type SupportedColonyClient = Exclude<
  AnyColonyClient,
  | ColonyClientV1
  | ColonyClientV2
  | ColonyClientV3
  | ColonyClientV4
  | ColonyClientV5
  | ColonyClientV6
  | ColonyClientV7
  | ColonyClientV8
  | ColonyClientV9
>;

const isSupportedColonyClient = (
  colonyClient: AnyColonyClient,
): colonyClient is SupportedColonyClient => {
  return (
    (colonyClient as SupportedColonyClient)[
      'setExpenditurePayout(uint256,uint256,uint256,uint256,address,uint256)'
    ] !== undefined
  );
};

export const getMulticallDataForPayout = (
  expenditure: Expenditure,
  payout: ExpenditurePayoutFieldValue,
  colonyClient: AnyColonyClient,
  permissionDomainId: BigNumber,
  childSkillIndex: BigNumber,
) => {
  if (!isSupportedColonyClient(colonyClient)) {
    throw new Error('Colony client not supported');
  }

  const encodedMulticallData: string[] = [];

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
        [MAPPING, ARRAY],
        [toB32(payout.slotId ?? ''), EXPENDITURESLOT_RECIPIENT],
        toB32(payout.recipientAddress),
      ]),
    );
  }

  // Set token address and amount
  const payoutAmountInWei = BigNumber.from(payout.amount)
    .mul(
      // @TODO: This should get the token decimals of the selected token
      BigNumber.from(10).pow(DEFAULT_TOKEN_DECIMALS),
    )
    .toString();
  const existingPayout = existingSlot?.payouts?.find(
    (slotPayout) =>
      slotPayout.amount === payoutAmountInWei &&
      slotPayout.tokenAddress === payout.tokenAddress,
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
          payoutAmountInWei,
        ],
      ),
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
        [MAPPING, ARRAY],
        [toB32(payout.slotId ?? ''), EXPENDITURESLOT_CLAIMDELAY],
        toB32(BigNumber.from(payout.claimDelay)),
      ]),
    );
  }

  return encodedMulticallData;
};
