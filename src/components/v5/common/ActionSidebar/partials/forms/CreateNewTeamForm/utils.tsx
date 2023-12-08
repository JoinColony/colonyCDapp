import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { Colony } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';

import { CreateNewTeamFormValues } from './consts';

export const createNewTeamDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<CreateNewTeamFormValues>
> = async ({ decisionMethod, teamName }, { getActionTitleValues }) => {
  return getActionTitleValues(
    {
      type:
        decisionMethod === DecisionMethod.Permissions
          ? ColonyActionType.CreateDomain
          : ColonyActionType.CreateDomainMotion,
      fromDomain: teamName
        ? {
            metadata: {
              name: teamName,
            },
          }
        : undefined,
    },
    {
      [ActionTitleMessageKeys.FromDomain]: '',
    },
  );
};

export const getCreateNewTeamPayload = (
  colony: Colony,
  values: CreateNewTeamFormValues,
) => ({
  ...values,
  domainName: values.teamName,
  isCreateDomain: true,
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  customActionTitle: values.title,
  motionDomainId: values.createdIn,
  annotationMessage: values.description,
});
