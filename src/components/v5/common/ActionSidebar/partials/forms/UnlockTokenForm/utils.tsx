import { DeepPartial } from 'utility-types';

import { ColonyActionType } from '~gql';
import { RootMotionMethodNames } from '~redux';
import { Colony } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { UnlockTokenFormValues } from './consts';

export const unlockTokenDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<UnlockTokenFormValues>
> = async ({ decisionMethod }, { getActionTitleValues }) => {
  return getActionTitleValues({
    type:
      decisionMethod === DecisionMethod.Permissions
        ? ColonyActionType.UnlockToken
        : ColonyActionType.UnlockTokenMotion,
  });
};

export const getUnlockTokenPayload = (
  colony: Colony,
  { description: annotationMessage, title }: UnlockTokenFormValues,
) => ({
  annotationMessage,
  colonyAddress: colony.colonyAddress,
  operationName: RootMotionMethodNames.UnlockToken,
  motionParams: [],
  colonyName: colony.name,
  customActionTitle: title,
});
