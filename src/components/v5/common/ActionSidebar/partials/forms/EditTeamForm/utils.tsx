import { DeepPartial } from 'utility-types';
import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { DECISION_METHOD } from '~v5/common/ActionSidebar/hooks';
import { DescriptionMetadataGetter } from '~v5/common/ActionSidebar/types';
import { getTeam } from '../utils';
import { EditTeamFormValues } from './consts';

export const editTeamDescriptionMetadataGetter: DescriptionMetadataGetter<
  DeepPartial<EditTeamFormValues>
> = async (
  { team: teamId, decisionMethod },
  { getActionTitleValues, colony },
) => {
  const team = getTeam(teamId, colony);

  return getActionTitleValues(
    {
      type:
        decisionMethod === DECISION_METHOD.Permissions
          ? ColonyActionType.EditDomain
          : ColonyActionType.EditDomainMotion,
      fromDomain: team,
    },
    {
      [ActionTitleMessageKeys.FromDomain]: '',
    },
  );
};
