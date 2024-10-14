import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type NotificationColonyFragment,
  useGetColonyActionQuery,
  useGetExpenditureQuery,
} from '~gql';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import NotificationWrapper from '../NotificationWrapper.tsx';

import ExpenditureNotificationMessage from './ExpenditureNotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureNotification';

interface NotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  isCurrentColony: boolean;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const ExpenditureNotification: FC<NotificationProps> = ({
  colony,
  isCurrentColony,
  loadingColony,
  notification,
}) => {
  const navigate = useNavigate();

  const { expenditureID } = notification.customAttributes || {};

  const { data: expenditureData, loading: loadingExpenditure } =
    useGetExpenditureQuery({
      variables: {
        expenditureId: expenditureID || '',
      },
      skip: !expenditureID,
    });

  const expenditure = expenditureData?.getExpenditure;

  const transactionHash =
    expenditure?.creatingActions?.items[0]?.transactionHash;

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

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      <ExpenditureNotificationMessage
        action={action}
        colony={colony}
        expenditure={expenditure}
        loading={loadingColony || loadingAction || loadingExpenditure}
        notification={notification}
      />
    </NotificationWrapper>
  );
};

ExpenditureNotification.displayName = displayName;

export default ExpenditureNotification;
