import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { Colony, Domain } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
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
        decisionMethod === DecisionMethod.Permissions
          ? ColonyActionType.EditDomain
          : ColonyActionType.EditDomainMotion,
      fromDomain: team,
    },
    {
      [ActionTitleMessageKeys.FromDomain]: '',
    },
  );
};

export const getEditDomainPayload = (
  colony: Colony,
  values: EditTeamFormValues,
  selectedDomain: Domain,
) => ({
  colonyAddress: colony.colonyAddress,
  colonyName: colony.name,
  domainName: values.teamName,
  domainColor: values.domainColor,
  domainPurpose: values.domainPurpose,
  domain: selectedDomain,
  annotationMessage: values.description,
  customActionTitle: values.title,
  motionDomainId: values.createdIn,
  isCreateDomain: false,
});
