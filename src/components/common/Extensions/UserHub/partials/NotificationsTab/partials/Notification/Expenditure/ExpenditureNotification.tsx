import React, { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  type NotificationColonyFragment,
  useGetColonyActionQuery,
  useGetExpenditureQuery,
  useGetUserByAddressQuery,
} from '~gql';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';

import NotificationWrapper from '../NotificationWrapper.tsx';

import ExpenditureNotificationMessage from './ExpenditureNotificationMessage.tsx';

const displayName =
  'common.Extensions.UserHub.partials.ExpenditureNotification';

interface NotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const ExpenditureNotification: FC<NotificationProps> = ({
  colony,
  loadingColony,
  notification,
}) => {
  const navigate = useNavigate();

  const { creator, expenditureID } = notification.customAttributes || {};

  const { data: userData, loading: loadingUser } = useGetUserByAddressQuery({
    variables: { address: creator || '' },
    skip: !creator,
  });
  const { data: expenditureData, loading: loadingExpenditure } =
    useGetExpenditureQuery({
      variables: {
        expenditureId: expenditureID || '',
      },
      skip: !expenditureID,
    });

  const creatorName =
    userData?.getUserByAddress?.items[0]?.profile?.displayName || '';

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
      <ExpenditureNotificationMessage
        action={action}
        colony={colony}
        creator={creatorName}
        expenditure={expenditure}
        loading={
          loadingColony || loadingAction || loadingUser || loadingExpenditure
        }
        notification={notification}
      />
    </NotificationWrapper>
  );
};

ExpenditureNotification.displayName = displayName;

export default ExpenditureNotification;
