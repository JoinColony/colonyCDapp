import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  validationSchema,
  type ManageColonyObjectivesFormValues,
} from './consts.ts';
import { getManageColonyObjectivesPayload } from './utils.tsx';

export const useManageColonyObjectives = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony;
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues: useMemo<DeepPartial<ManageColonyObjectivesFormValues>>(
      () => ({
        colonyDisplayName: metadata?.displayName || '',
        avatar: {
          image: metadata?.avatar,
          thumbnail: metadata?.thumbnail,
        },
        createdIn: Id.RootDomain,
        colonyObjectiveTitle: metadata?.objective?.title,
        colonyObjectiveDescription: metadata?.objective?.description,
        colonyObjectiveProgress: metadata?.objective?.progress,
      }),
      [
        metadata?.avatar,
        metadata?.displayName,
        metadata?.thumbnail,
        metadata?.objective,
      ],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_EDIT_COLONY
        : ActionTypes.MOTION_EDIT_COLONY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: ManageColonyObjectivesFormValues) => {
          return getManageColonyObjectivesPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
