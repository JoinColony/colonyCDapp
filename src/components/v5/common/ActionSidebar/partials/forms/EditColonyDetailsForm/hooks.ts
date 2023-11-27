import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { getEditColonyDetailsDialogPayload } from '~common/Dialogs/EditColonyDetailsDialog/helpers';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import {
  DecisionMethod,
  DECISION_METHOD,
  useActionFormBaseHook,
} from '../../../hooks';
import { validationSchema, EditColonyDetailsFormValues } from './consts';

export const useEditColonyDetails = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { metadata } = colony || {};
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    defaultValues: useMemo<DeepPartial<EditColonyDetailsFormValues>>(
      () => ({
        colonyDisplayName: metadata?.displayName || '',
        avatar: {
          image: metadata?.avatar,
          thumbnail: metadata?.thumbnail,
        },
        createdIn: Id.RootDomain.toString(),
        externalLinks:
          metadata?.externalLinks?.map(({ name, link }) => ({
            url: link,
            linkType: name,
          })) || [],
      }),
      [
        metadata?.avatar,
        metadata?.displayName,
        metadata?.externalLinks,
        metadata?.thumbnail,
      ],
    ),
    actionType:
      decisionMethod === DECISION_METHOD.Permissions
        ? ActionTypes.ACTION_EDIT_COLONY
        : ActionTypes.MOTION_EDIT_COLONY,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: EditColonyDetailsFormValues) => {
          const values = {
            colonyDisplayName: payload.colonyName,
            colonyAvatarImage: payload.avatar?.image,
            colonyThumbnail: payload.avatar?.thumbnail,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotationMessage: payload.description,
            externalLinks: payload.externalLinks.map(
              ({ linkType, ...link }) => ({
                ...link,
                name: linkType,
              }),
            ),
            colonyDescription: payload.colonyDescription,
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
