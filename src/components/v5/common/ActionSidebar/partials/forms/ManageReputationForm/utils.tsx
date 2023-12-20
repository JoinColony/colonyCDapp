import { DeepPartial } from 'utility-types';
import Decimal from 'decimal.js';
import { BigNumber } from 'ethers';

import { Colony } from '~types';
import { ManageReputationMotionPayload } from '~redux/sagas/motions/manageReputationMotion';
import { ADDRESS_ZERO } from '~constants';
import { ColonyActionType, ColonyMetadataChangelog } from '~gql';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { ManageReputationFormValues, ModificationOption } from './consts';

export const manageReputationDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<ManageReputationFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  const changelogItem: Partial<ColonyMetadataChangelog> = {
    haveTokensChanged: true,
    transactionHash: ADDRESS_ZERO,
  };

  // @todo: update
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.ColonyEdit
        : ColonyActionType.ColonyEditMotion,
    pendingColonyMetadata: {
      changelog: [changelogItem],
    },
    isMotion: true,
  });
};

export const getManageReputationPayload = (
  colony: Colony,
  nativeTokenDecimals: number,
  {
    amount,
    team,
    description: annotation,
    member,
    motionDomainId,
    modification,
  }: ManageReputationFormValues,
) => {
  const isSmiteAction = modification === ModificationOption.RemoveReputation;
  const reputationChangeAmount = new Decimal(amount)
    .mul(new Decimal(10).pow(nativeTokenDecimals))
    // Smite amount needs to be negative, otherwise leave it as it is
    .mul(isSmiteAction ? -1 : 1);

  return {
    colonyAddress: colony.colonyAddress,
    colonyName: colony.name,
    domainId: Number(team),
    motionDomainId: Number(motionDomainId),
    userAddress: member ?? '',
    annotationMessage: annotation,
    amount: BigNumber.from(reputationChangeAmount.toString()),
    isSmitingReputation: isSmiteAction,
    customActionTitle: '',
  } as ManageReputationMotionPayload;
};
