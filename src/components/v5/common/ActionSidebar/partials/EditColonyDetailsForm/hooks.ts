import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { MAX_ANNOTATION_LENGTH, MAX_COLONY_DISPLAY_NAME } from '~constants';
import { useActionHook } from '../ActionForm/hooks';
import { getEditColonyDetailsDialogPayload } from '~common/Dialogs/EditColonyDetailsDialog/helpers';
import { useColnyAvatarContext } from '~context/ColnyAvatarContext';

export const useEditColonyDetails = () => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const navigate = useNavigate();
  const { colonyAvatar, colonyThumbnail } = useColnyAvatarContext();

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.bool().defined(),
      colonyAvatarImage: yup.string().nullable().defined(),
      colonyThumbnail: yup.string().nullable().defined(),
      colonyDisplayName: yup
        .string()
        .trim()
        .max(MAX_COLONY_DISPLAY_NAME)
        .required(() => 'Colony name is required'),
      createdIn: yup.number().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        colonyDisplayName: payload.colonyDisplayName,
        colonyAvatarImage: colonyAvatar || payload.avatar,
        colonyThumbnail: colonyThumbnail || payload.colonyThumbnail,
        motionDomainId: payload.createdIn,
        decisionMethod: payload.decisionMethod,
        annotationMessage: payload.annotation,
      };
      if (colony) {
        return getEditColonyDetailsDialogPayload(colony, values);
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      decisionMethod: 'reputation',
      colonyDisplayName: metadata?.displayName || '',
      colonyAvatarImage: metadata?.avatar || '',
      colonyThumbnail: metadata?.thumbnail || '',
      annotation: '',
      createdIn: 1,
    },
    defaultAction: ActionTypes.ACTION_EDIT_COLONY,
    actionType: ActionTypes.MOTION_EDIT_COLONY,
  });
};
