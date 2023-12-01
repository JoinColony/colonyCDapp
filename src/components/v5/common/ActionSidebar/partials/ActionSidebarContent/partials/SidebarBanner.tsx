import React, { FC } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { Action } from '~constants/actions';
import { useFlatFormErrors } from '~hooks';
import {
  ACTION_TYPE_FIELD_NAME,
  ACTION_TYPE_NOTIFICATION,
} from '../../../consts';
import { formatText } from '~utils/intl';
import NotificationBanner from '~v5/shared/NotificationBanner';

export const SidebarBanner: FC = () => {
  const { formState } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const flatFormErrors = useFlatFormErrors(formState.errors).filter(
    ({ key }) => key !== 'title',
  );

  const actionTypeNotificationTitle = selectedAction
    ? ACTION_TYPE_NOTIFICATION[selectedAction]
    : undefined;

  if (actionTypeNotificationTitle) {
    return (
      <div className="mt-6">
        <NotificationBanner
          status="error"
          icon="warning-circle"
          callToAction={
            <button type="button">{formatText({ id: 'learn.more' })}</button>
          }
        >
          {actionTypeNotificationTitle}
        </NotificationBanner>
      </div>
    );
  }

  if (!hasErrors || !flatFormErrors.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <NotificationBanner
        status="error"
        icon="warning-circle"
        description={
          flatFormErrors.length ? (
            <ul className="list-disc list-inside text-negative-400">
              {flatFormErrors.map(({ key, message }) => (
                <li key={key}>{message}</li>
              ))}
            </ul>
          ) : null
        }
      >
        {formatText({ id: 'actionSidebar.fields.error' })}
      </NotificationBanner>
    </div>
  );
};
