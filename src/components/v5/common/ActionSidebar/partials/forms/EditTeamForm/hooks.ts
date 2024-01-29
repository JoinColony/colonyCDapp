import { Id } from '@colony/colony-js';
import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { validationSchema, type EditTeamFormValues } from './consts.ts';
import { getEditDomainPayload } from './utils.tsx';

export const useEditTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { setValue } = useFormContext();

  const { [DECISION_METHOD_FIELD_NAME]: decisionMethod, team } = useWatch<{
    decisionMethod: DecisionMethod;
    team: number;
  }>();

  const selectedDomain = findDomainByNativeId(team, colony);

  useEffect(() => {
    if (!selectedDomain) {
      return;
    }

    const { metadata, nativeId } = selectedDomain;

    setValue('teamName', metadata?.name);
    setValue('domainPurpose', metadata?.description);
    setValue('domainColor', metadata?.color);
    setValue('createdIn', nativeId);
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
        createdIn: team || Id.RootDomain,
        teamName: selectedDomain?.metadata?.name,
        domainPurpose: selectedDomain?.metadata?.description,
        domainColor: selectedDomain?.metadata?.color,
      }),
      [
        selectedDomain?.metadata?.color,
        selectedDomain?.metadata?.description,
        selectedDomain?.metadata?.name,
        team,
      ],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: EditTeamFormValues) => {
          if (!selectedDomain) {
            return null;
          }

          return getEditDomainPayload(colony, values, selectedDomain);
        }),
      ),
      [colony, selectedDomain],
    ),
  });
};
