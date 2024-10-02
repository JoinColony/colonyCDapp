import React, { useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type ColonyFragment,
  useGetColonyActionQuery,
  useGetUserByAddressQuery,
} from '~gql';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import NotificationWrapper from '../NotificationWrapper.tsx';

import ActionNotificationMessage from './ActionNotificationMessage.tsx';

const displayName = 'common.Extensions.UserHub.partials.ActionNotification';

interface NotificationProps {
  colony: ColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const ActionNotification: FC<NotificationProps> = ({
  colony,
  loadingColony,
  notification,
}) => {
  const navigate = useNavigate();

  const { creator, transactionHash } = notification.customAttributes || {};

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

  const creatorName = useMemo(() => {
    return userData?.getUserByAddress?.items[0]?.profile?.displayName ?? '';
  }, [userData]);

  const action = useMemo(() => {
    return actionData?.getColonyAction;
  }, [actionData]);

  const handleNotificationClicked = () => {
    if (transactionHash) {
      navigate(
        `${window.location.pathname}?${TX_SEARCH_PARAM}=${transactionHash}`,
        {
          replace: true,
        },
      );
    }
  };

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      <ActionNotificationMessage
        action={action}
        colony={colony}
        creator={creatorName}
        loading={loadingColony || loadingAction || loadingUser}
        notification={notification}
      />
    </NotificationWrapper>
  );
};

ActionNotification.displayName = displayName;

export default ActionNotification;
