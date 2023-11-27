import React, { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { Action } from '~constants/actions';
import { useFlatFormErrors } from '~hooks';
import { ACTION_TYPE_FIELD_NAME, ACTION_TYPE_NOTIFICATION } from '../consts';
import { NotificationBannerProps } from '~common/Extensions/NotificationBanner/types';
import { formatText } from '~utils/intl';

export const useNotificationBanner = ():
  | NotificationBannerProps
  | undefined => {
  const { formState } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const flatFormErrors = useFlatFormErrors(formState.errors).filter(
    ({ key }) => key !== 'title',
  );

  return useMemo(() => {
    const actionTypeNotificationTitle = selectedAction
      ? ACTION_TYPE_NOTIFICATION[selectedAction]
      : undefined;

    if (actionTypeNotificationTitle) {
      return {
        status: 'error',
        title: actionTypeNotificationTitle,
        action: {
          type: 'call-to-action',
          actionText: formatText({ id: 'learn.more' }),
        },
      };
    }

    if (!hasErrors || !flatFormErrors.length) {
      return undefined;
    }

    return {
      status: 'error',
      title: formatText({ id: 'actionSidebar.fields.error' }),
      children: flatFormErrors.length ? (
        <ul className="list-disc list-inside">
          {flatFormErrors.map(({ key, message }) => (
            <li key={key}>{message}</li>
          ))}
        </ul>
      ) : undefined,
    };
  }, [flatFormErrors, hasErrors, selectedAction]);
};
