import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getCreateDomainDialogPayload } from '~common/Dialogs/CreateDomainDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, CreateNewTeamFormValues } from './consts';

export const useCrateNewTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    actionType: isVotingReputationEnabled
      ? ActionTypes.MOTION_DOMAIN_CREATE_EDIT
      : ActionTypes.ACTION_DOMAIN_CREATE,
    defaultValues: useMemo<DeepPartial<CreateNewTeamFormValues>>(
      () => ({
        teamName: '',
        domainPurpose: '',
        domainColor: '',
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        description: '',
      }),
      [],
    ),
    getFormOptions,
    validationSchema,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: CreateNewTeamFormValues) => {
          const values = {
            domainName: payload.teamName,
            domainPurpose: payload.domainPurpose,
            domainColor: payload.domainColor,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getCreateDomainDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
