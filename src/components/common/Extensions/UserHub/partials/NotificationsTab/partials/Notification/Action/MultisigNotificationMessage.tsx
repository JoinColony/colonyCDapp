import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import {
  type ColonyActionFragment,
  type NotificationColonyFragment,
} from '~gql';
import { useAmountLessFee } from '~hooks/useAmountLessFee.ts';
import { NotificationType, type Notification } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import NotificationMessage from '../NotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.MultisigNotificationMessage';

interface MultisigNotificationMessageProps {
  action: ColonyActionFragment | null | undefined;
  colony: NotificationColonyFragment | null | undefined;
  creator: string;
  loading: boolean;
  notification: Notification;
}

const MSG = defineMessages({
  finalized: {
    id: `${displayName}.finalized`,
    defaultMessage: 'Finalized:',
  },
  approved: {
    id: `${displayName}.approved`,
    defaultMessage: 'Approved:',
  },
  rejected: {
    id: `${displayName}.rejected`,
    defaultMessage: 'Rejected:',
  },
  unknownAction: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'A multisig action was updated',
  },
  unknownChange: {
    id: `${displayName}.unknownChange`,
    defaultMessage: 'Multisig action updated: ',
  },
});

const MultisigNotificationMessage: FC<MultisigNotificationMessageProps> = ({
  action,
  colony,
  creator,
  loading,
  notification,
}) => {
  const { notificationType } = notification.customAttributes || {};

  const amountLessFee = useAmountLessFee(action?.amount, action?.networkFee);

  const actionMetadataDescription = useMemo(() => {
    if (!action || !colony) {
      return formatText(MSG.unknownAction);
    }

    return formatText(
      { id: 'action.title' },
      getActionTitleValues({
        actionData: { ...action, amount: amountLessFee },
        colony: {
          nativeToken: {
            ...colony.nativeToken,
          },
          metadata: colony.metadata,
        },
      }),
    );
  }, [action, amountLessFee, colony]);

  const Message = useMemo(() => {
    if (!creator || !action || !notificationType) {
      return formatText(MSG.unknownAction);
    }

    if (notificationType === NotificationType.MultiSigActionCreated) {
      return (
        <>
          {action.metadata?.customTitle}: {actionMetadataDescription}
        </>
      );
    }

    const firstPart = {
      [NotificationType.MultiSigActionFinalized]: formatText(MSG.finalized),
      [NotificationType.MultiSigActionApproved]: formatText(MSG.approved),
      [NotificationType.MultiSigActionRejected]: formatText(MSG.rejected),
      default: formatText(MSG.unknownChange),
    }[notificationType];

    return (
      <>
        {firstPart} {action.metadata?.customTitle || actionMetadataDescription}
      </>
    );
  }, [action, actionMetadataDescription, creator, notificationType]);

  return <NotificationMessage loading={loading}>{Message}</NotificationMessage>;
};

MultisigNotificationMessage.displayName = displayName;

export default MultisigNotificationMessage;
