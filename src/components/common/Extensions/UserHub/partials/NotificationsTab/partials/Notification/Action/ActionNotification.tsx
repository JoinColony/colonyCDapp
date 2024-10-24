import React, { useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { getActionTitleValues } from '~common/ColonyActions/index.ts';
import {
  type NotificationColonyFragment,
  NotificationType,
  useGetColonyActionQuery,
  useGetUserByAddressQuery,
} from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

import NotificationWrapper from '../NotificationWrapper.tsx';

import ActionNotificationMessage from './ActionNotificationMessage.tsx';
import MotionNotificationMessage from './MotionNotificationMessage.tsx';
import MultisigNotificationMessage from './MultisigNotificationMessage.tsx';

const displayName = 'common.Extensions.UserHub.partials.ActionNotification';

interface NotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  isCurrentColony: boolean;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const ActionNotification: FC<NotificationProps> = ({
  colony,
  isCurrentColony,
  loadingColony,
  notification,
}) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const navigate = useNavigate();

  const { creator, notificationType, transactionHash } =
    notification.customAttributes || {};

  const { data: userData, loading: loadingUser } = useGetUserByAddressQuery({
    variables: { address: creator || '' },
    skip: !creator,
  });
  const { data: actionData, loading: loadingAction } = useGetColonyActionQuery({
    variables: {
      transactionHash: transactionHash || '',
    },
    skip: !transactionHash,
  });

  const action = actionData?.getColonyAction;

  const handleNotificationClicked = () => {
    if (!transactionHash) {
      return;
    }

    const path = isCurrentColony
      ? window.location.pathname
      : `/${colony?.name}`;

    navigate(`${path}?${TX_SEARCH_PARAM}=${transactionHash}`, {
      replace: true,
    });
  };

  const actionMetadataDescription = useMemo(() => {
    if (!action || !colony) {
      return null;
    }

    return formatText(
      { id: 'action.title' },
      getActionTitleValues({
        actionData: action,
        colony: {
          nativeToken: {
            ...colony.nativeToken,
          },
          metadata: colony.metadata,
        },
        networkInverseFee,
      }),
    );
  }, [action, colony, networkInverseFee]);

  const actionTitle =
    action?.metadata?.customTitle || action?.decisionData?.title || '';

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      {notificationType &&
        [NotificationType.PermissionsAction, NotificationType.Mention].includes(
          notificationType,
        ) && (
          <ActionNotificationMessage
            actionMetadataDescription={actionMetadataDescription}
            actionTitle={actionTitle}
            creator={
              userData?.getUserByAddress?.items[0]?.profile?.displayName ?? ''
            }
            loading={loadingColony || loadingAction || loadingUser}
            notificationType={notificationType}
          />
        )}
      {notificationType &&
        [
          NotificationType.MultisigActionCreated,
          NotificationType.MultisigActionFinalized,
          NotificationType.MultisigActionApproved,
          NotificationType.MultisigActionRejected,
        ].includes(notificationType) && (
          <MultisigNotificationMessage
            actionMetadataDescription={actionMetadataDescription}
            actionTitle={actionTitle}
            loading={loadingColony || loadingAction || loadingUser}
            notificationType={notificationType}
          />
        )}
      {notificationType &&
        [
          NotificationType.MotionCreated,
          NotificationType.MotionOpposed,
          NotificationType.MotionSupported,
          NotificationType.MotionVoting,
          NotificationType.MotionReveal,
          NotificationType.MotionFinalized,
        ].includes(notificationType) && (
          <MotionNotificationMessage
            actionMetadataDescription={actionMetadataDescription}
            actionTitle={actionTitle}
            loading={loadingColony || loadingAction || loadingUser}
            notificationType={notificationType}
          />
        )}
    </NotificationWrapper>
  );
};

ActionNotification.displayName = displayName;

export default ActionNotification;
