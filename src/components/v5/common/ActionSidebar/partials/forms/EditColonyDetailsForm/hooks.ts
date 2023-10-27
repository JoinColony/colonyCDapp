import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getEditColonyDetailsDialogPayload } from '~common/Dialogs/EditColonyDetailsDialog/helpers';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, EditColonyDetailsFormValues } from './consts';

export const useEditColonyDetails = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const { isVotingReputationEnabled } = useEnabledExtensions();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues: useMemo<DeepPartial<EditColonyDetailsFormValues>>(
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
        mapPayload((payload: EditColonyDetailsFormValues) => {
          const values = {
            colonyDisplayName: payload.colonyDisplayName,
            colonyAvatarImage: payload.avatar?.image,
            colonyThumbnail: payload.avatar?.thumbnail,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotationMessage: payload.description,
            externalLinks: [], // @todo: wire into form
            colonyDescription: '', // @todo: wire into form
          };

          if (colony) {
            return getEditColonyDetailsDialogPayload(colony, values);
          }

          return null;
        }),
      ),
      [colony],
    ),
  });
};
