import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { validationSchema, ManageColonyObjectivesFormValues } from './consts';
import { getManageColonyObjectivesPayload } from './utils';

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
