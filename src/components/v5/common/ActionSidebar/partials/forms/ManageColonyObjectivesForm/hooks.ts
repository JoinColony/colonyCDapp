import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, ManageColonyObjectivesFormValues } from './consts';

export const useManageColonyObjectives = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues: useMemo<DeepPartial<ManageColonyObjectivesFormValues>>(
      () => ({
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        colonyDisplayName: metadata?.displayName || '',
        avatar: {
          image: metadata?.avatar,
          thumbnail: metadata?.thumbnail,
        },
        description: '',
        createdIn: Id.RootDomain.toString(),
      }),
      [metadata?.avatar, metadata?.displayName, metadata?.thumbnail],
    ),
    actionType: isVotingReputationEnabled
      ? ActionTypes.MOTION_EDIT_COLONY
      : ActionTypes.ACTION_EDIT_COLONY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: ManageColonyObjectivesFormValues) => {
          const values = {
            colonyObjective: {
              title: payload.colonyObjectiveTitle,
              description: payload.colonyObjectiveDescription,
              progress: payload.colonyObjectiveProgress,
            },
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotationMessage: payload.description,
          };

          if (colony) {
            return { colony, ...values };
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
