import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';
import { getEditColonyDetailsDialogPayload } from '~common/Dialogs/EditColonyDetailsDialog/helpers';
import { useColonyAvatarContext } from '~context/ColonyAvatarContext';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const validationSchema = yup
  .object()
  .shape({
    colonyAvatarImage: yup.string().nullable().defined(),
    colonyThumbnail: yup.string().nullable().defined(),
    colonyDisplayName: yup
      .string()
      .trim()
      .max(MAX_COLONY_DISPLAY_NAME)
      .required(() => 'Colony name is required'),
    createdIn: yup.number().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

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
    defaultValues: useMemo(
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
        mapPayload((payload) => {
          const values = {
            colonyDisplayName: payload.colonyDisplayName,
            colonyAvatarImage: colonyAvatar || payload.avatar,
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
