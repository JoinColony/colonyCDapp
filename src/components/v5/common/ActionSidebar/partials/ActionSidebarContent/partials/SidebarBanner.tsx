import React, { FC } from 'react';
import { Extension, Id } from '@colony/colony-js';

import { useFormContext, useWatch } from 'react-hook-form';
import { ACTION, Action } from '~constants/actions';
import { useColonyContext, useExtensionData, useFlatFormErrors } from '~hooks';
import { formatText } from '~utils/intl';
import NotificationBanner from '~v5/shared/NotificationBanner';
import { AnyExtensionData, Colony } from '~types';
import { addressHasRoles } from '~utils/checks';

import {
  ACTION_TYPE_FIELD_NAME,
  useCreateActionTypeNotification,
  useCreateActionTypeNotificationHref,
} from '../../../consts';

const checkOneTxPaymentPermissions = (
  extensionData: AnyExtensionData,
  colony: Colony | undefined,
) => {
  const {
    neededColonyPermissions,
    // address will be undefined if the extension hasn't been installed / initialized yet
    // @ts-expect-error
    address,
    isInitialized,
    isDeprecated,
  } = extensionData;

  // If the extension itself doesn't have the correct permissions, show the banner
  const noPermissions =
    isInitialized &&
    !isDeprecated &&
    !addressHasRoles({
      requiredRolesDomains: [Id.RootDomain],
      colony,
      requiredRoles: neededColonyPermissions,
      address,
    });

  return noPermissions;
};

export const SidebarBanner: FC = () => {
  const { colony } = useColonyContext();
  const { formState } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const selectedAction: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });
  const flatFormErrors = useFlatFormErrors(formState.errors).filter(
    ({ key }) => key !== 'title',
  );

  const actionTypeNotificationTitle =
    useCreateActionTypeNotification(selectedAction);
  const actionTypeNofiticationHref =
    useCreateActionTypeNotificationHref(selectedAction);

  const oneTxPaymentExtensionId =
    selectedAction === ACTION.SIMPLE_PAYMENT ? Extension.OneTxPayment : '';
  const { extensionData } = useExtensionData(oneTxPaymentExtensionId);
  const oneTxPaymentPermissionNeeded = extensionData
    ? checkOneTxPaymentPermissions(extensionData, colony)
    : false;

  if (actionTypeNotificationTitle) {
    if (
      selectedAction === ACTION.SIMPLE_PAYMENT &&
      !oneTxPaymentPermissionNeeded
    ) {
      return null;
    }

    return (
      <div className="mt-7">
        <NotificationBanner
          status={oneTxPaymentPermissionNeeded ? 'warning' : 'error'}
          icon="warning-circle"
          callToAction={
            <a
              href={actionTypeNofiticationHref}
              target="_blank"
              rel="noreferrer"
            >
              {formatText({ id: 'learn.more' })}
            </a>
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
    <div className="mt-7">
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
