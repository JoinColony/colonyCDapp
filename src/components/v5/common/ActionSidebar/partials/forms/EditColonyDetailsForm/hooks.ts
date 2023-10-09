import { useNavigate } from 'react-router-dom';

import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getEditColonyDetailsDialogPayload } from '~common/Dialogs/EditColonyDetailsDialog/helpers';
import { useColonyAvatarContext } from '~context/ColonyAvatarContext';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { validationSchema, EditColonyDetailsFormValues } from './consts';

export const useEditColonyDetails = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const navigate = useNavigate();
  const { colonyAvatar, colonyThumbnail } = useColonyAvatarContext();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues: useMemo<DeepPartial<EditColonyDetailsFormValues>>(
      () => ({
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        colonyDisplayName: metadata?.displayName || '',
        colonyAvatarImage: metadata?.avatar || '',
        colonyThumbnail: metadata?.thumbnail || '',
        description: '',
        createdIn: Id.RootDomain.toString(),
      }),
      [metadata],
    ),
    actionType: ActionTypes.MOTION_EDIT_COLONY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: EditColonyDetailsFormValues) => {
          const values = {
            colonyDisplayName: payload.colonyDisplayName,
            colonyAvatarImage: colonyAvatar || payload.colonyAvatarImage,
            colonyThumbnail: colonyThumbnail || payload.colonyThumbnail,
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
        withMeta({ navigate }),
      ),
      [navigate, colony, colonyAvatar, colonyThumbnail],
    ),
  });
};
