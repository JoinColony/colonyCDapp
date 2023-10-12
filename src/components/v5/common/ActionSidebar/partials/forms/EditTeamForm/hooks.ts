import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getEditDomainDialogPayload } from '~common/Dialogs/EditDomainDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, EditTeamFormValues } from './consts';

export const useEditTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();
  const { domains } = colony || {};
  const { watch, setValue } = useFormContext();

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
    actionType: ActionTypes.ACTION_DOMAIN_EDIT,
    defaultValues: useMemo<DeepPartial<EditTeamFormValues>>(
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
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
  });
};
