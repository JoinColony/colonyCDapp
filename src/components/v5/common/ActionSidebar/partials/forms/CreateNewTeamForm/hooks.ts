import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { validationSchema, type CreateNewTeamFormValues } from './consts.ts';
import { getCreateNewTeamPayload } from './utils.tsx';

export const useCreateNewTeam = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_DOMAIN_CREATE
        : ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    defaultValues: useMemo<DeepPartial<CreateNewTeamFormValues>>(
      () => ({
        createdIn: Id.RootDomain,
      }),
      [],
    ),
    getFormOptions,
    validationSchema,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: CreateNewTeamFormValues) => {
          return getCreateNewTeamPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
