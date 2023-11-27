import { useCallback, useEffect, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getEditDomainDialogPayload } from '~common/Dialogs/EditDomainDialog/helpers';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { validationSchema, EditTeamFormValues } from './consts';

export const useEditTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { domains } = colony || {};
  const { watch, setValue } = useFormContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  const selectedTeamId = watch('team');
  const selectedTeam = domains?.items.find(
    (item) => item?.nativeId === parseFloat(selectedTeamId),
  );

  useEffect(() => {
    if (!selectedTeam) {
      return;
    }

    const { metadata } = selectedTeam;

    setValue('teamName', metadata?.name);
    setValue('domainPurpose', metadata?.description);
    setValue('domainColor', metadata?.color);
  }, [selectedTeam, setValue]);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DECISION_METHOD.Permissions
        ? ActionTypes.ACTION_DOMAIN_EDIT
        : ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    defaultValues: useMemo<DeepPartial<EditTeamFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: EditTeamFormValues) => {
          const values = {
            domainId: payload.team,
            domainName: payload.teamName,
            domainPurpose: payload.domainPurpose,
            domainColor: payload.domainColor,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getEditDomainDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
