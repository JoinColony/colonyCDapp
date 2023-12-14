import { useCallback, useEffect, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useFormContext, useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import { findDomainByNativeId } from '~utils/domains';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { validationSchema, EditTeamFormValues } from './consts';
import { getEditDomainPayload } from './utils';

export const useEditTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { setValue } = useFormContext();

  const { [DECISION_METHOD_FIELD_NAME]: decisionMethod, team } = useWatch<{
    decisionMethod: DecisionMethod;
    team: string;
  }>();

  const selectedDomainId = Number(team);
  const selectedDomain = findDomainByNativeId(selectedDomainId, colony);

  useEffect(() => {
    if (!selectedDomain) {
      return;
    }

    const { metadata, nativeId } = selectedDomain;

    setValue('teamName', metadata?.name);
    setValue('domainPurpose', metadata?.description);
    setValue('domainColor', metadata?.color);
    setValue('createdIn', nativeId.toString());
  }, [selectedDomain, setValue]);

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_DOMAIN_EDIT
        : ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    defaultValues: useMemo<DeepPartial<EditTeamFormValues>>(
      () => ({
        createdIn: selectedDomainId.toString() || Id.RootDomain.toString(),
      }),
      [selectedDomainId],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: EditTeamFormValues) => {
          if (!colony || !selectedDomain) {
            return null;
          }

          return getEditDomainPayload(colony, values, selectedDomain);
        }),
      ),
      [colony, selectedDomain],
    ),
  });
};
