import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { ColonyActionType } from '~gql';
import { ActionTypes } from '~redux';
import { Colony, Domain } from '~types';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import {
  ActionPayloadWithoutCustomTitle,
  DescriptionMetadataGetter,
} from '~v5/common/ActionSidebar/types';

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
  {
    description,
    domainColor,
    domainPurpose,
    teamName,
    decisionMethod: decisionMethodValue,
  }: EditTeamFormValues,
  domain: Domain,
) => {
  const payload: ActionPayloadWithoutCustomTitle<ActionTypes.ACTION_DOMAIN_EDIT> =
    {
      colonyAddress: colony?.colonyAddress,
      annotationMessage: description,
      colonyName: colony.name,
      domain,
      domainColor,
      domainName: teamName,
      domainPurpose,
    };
  const motionPayload: ActionPayloadWithoutCustomTitle<ActionTypes.MOTION_DOMAIN_CREATE_EDIT> =
    {
      isCreateDomain: false,
      motionDomainId: domain.nativeId,
      domainName: teamName,
      ...payload,
    };

  return decisionMethodValue === DecisionMethod.Permissions
    ? payload
    : motionPayload;
};
