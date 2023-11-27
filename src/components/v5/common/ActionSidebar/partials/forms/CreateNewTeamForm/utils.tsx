import { DeepPartial } from 'utility-types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { CreateNewTeamFormValues } from './consts';

export const createNewTeamDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<CreateNewTeamFormValues>
> = async ({ decisionMethod, teamName }, { getActionTitleValues }) => {
  return getActionTitleValues(
    {
      type:
        decisionMethod === DECISION_METHOD.Permissions
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
