import React, { FC } from 'react';
import { Extension } from '@colony/colony-js';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { ACTION } from '~constants/actions';
import { useExtensionsData, useFlatFormErrors } from '~hooks';
import { formatText } from '~utils/intl';
import NotificationBanner from '~v5/shared/NotificationBanner';
import {
  DecisionMethod,
  PERMISSIONS_VALIDATION_FIELD_NAME,
  REPUTATION_VALIDATION_FIELD_NAME,
} from '~v5/common/ActionSidebar/hooks';

import {
  ACTION_TYPE_FIELD_NAME,
  useCreateActionTypeNotification,
  useCreateActionTypeNotificationHref,
  DECISION_METHOD_FIELD_NAME,
} from '../../../consts';

const displayName =
  'v5.common.ActionSidebar.ActionSidebarContent.SidebarBanner';

const MSG = defineMessages({
  extensionPermissionNeeded: {
    id: `${displayName}.oneTxPaymentPermissionNeeded`,
    defaultMessage:
      'The {extensionName} extension is missing some or all of the permissions it needs to work.',
  },
});

export const SidebarBanner: FC = () => {
  const { formState, watch } = useFormContext();
  const hasErrors = !formState.isValid && formState.isSubmitted;
  const [selectedAction, decisionMethod] = watch([
    ACTION_TYPE_FIELD_NAME,
    DECISION_METHOD_FIELD_NAME,
  ]);
  const flatFormErrors = useFlatFormErrors(formState.errors).filter(
    ({ key }) =>
      ![
        'title',
        REPUTATION_VALIDATION_FIELD_NAME,
        PERMISSIONS_VALIDATION_FIELD_NAME,
      ].includes(String(key)),
  );

  const actionTypeNotificationTitle =
    useCreateActionTypeNotification(selectedAction);
  const actionTypeNofiticationHref =
    useCreateActionTypeNotificationHref(selectedAction);

  const { installedExtensionsData } = useExtensionsData();

  const requiredExtensionsWithoutPermission = installedExtensionsData.filter(
    (extension) => {
      const isOneTxPaymentExtensionAction =
        selectedAction === ACTION.SIMPLE_PAYMENT &&
        extension.extensionId === Extension.OneTxPayment;
      const isVotingReputationExtensionAction =
        decisionMethod === DecisionMethod.Reputation &&
        extension.extensionId === Extension.VotingReputation;

      if (isOneTxPaymentExtensionAction || isVotingReputationExtensionAction) {
        return !!extension.missingColonyPermissions.length;
      }
      return false;
    },
  );

  return (
    <>
      {actionTypeNotificationTitle && (
        <div className="mt-6">
          <NotificationBanner
            status="error"
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
      )}
      {requiredExtensionsWithoutPermission.map((extension) => (
        <div className="mt-6">
          <NotificationBanner status="warning" icon="warning-circle">
            <FormattedMessage
              {...MSG.extensionPermissionNeeded}
              values={{ extensionName: formatText(extension.name) }}
            />
          </NotificationBanner>
        </div>
      ))}
      {(hasErrors || !!flatFormErrors.length) && (
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
      )}
    </>
  );
};
