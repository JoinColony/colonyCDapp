import { type AnyColonyClient } from '@colony/colony-js';
import { BigNumber, type BigNumberish, utils } from 'ethers';

import { type Expenditure } from '~types/graphql.ts';

const toB32 = (input: BigNumberish) =>
  utils.hexZeroPad(utils.hexlify(input), 32);

const EXPENDITURESLOTS_SLOT = BigNumber.from(26);

const EXPENDITURESLOT_CLAIMDELAY = toB32(BigNumber.from(0));

const releaseStagedExpenditureMask = [false, true];

export const getMulticallDataForStageRelease = (
  expenditure: Expenditure,
  slotId: number,
  colonyClient: AnyColonyClient,
  permissionDomainId: BigNumber,
  childSkillIndex: BigNumber,
  tokenAddresses: string[],
) => {
  const keys = [toB32(slotId), EXPENDITURESLOT_CLAIMDELAY];

  const encodedMulticallData: string[] = [];

  encodedMulticallData.push(
    colonyClient.interface.encodeFunctionData('setExpenditureState', [
      permissionDomainId,
      childSkillIndex,
      expenditure.nativeId,
      EXPENDITURESLOTS_SLOT, // @NOTE: Memory slot of expenditure's slots
      releaseStagedExpenditureMask,
      keys,
      toB32(0),
    ]),
  );

  for (const tokenAddress of tokenAddresses) {
    encodedMulticallData.push(
      colonyClient.interface.encodeFunctionData('claimExpenditurePayout', [
        expenditure.nativeId,
        slotId,
        tokenAddress,
      ]),
    );
  }

  return encodedMulticallData;
};
