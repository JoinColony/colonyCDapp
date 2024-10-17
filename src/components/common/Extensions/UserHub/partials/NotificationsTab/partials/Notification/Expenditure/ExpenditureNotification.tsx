import React, { useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { getActionTitleValues } from '~common/ColonyActions/index.ts';
import {
  type NotificationColonyFragment,
  NotificationType,
  useGetColonyActionQuery,
  useGetExpenditureQuery,
} from '~gql';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

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

  const { expenditureID, notificationType } =
    notification.customAttributes || {};

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

  const actionTitle = action?.metadata?.customTitle || '';

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
        expenditureData: expenditure ?? undefined,
      }),
    );
  }, [action, expenditure, colony]);

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      {notificationType &&
        [
          NotificationType.ExpenditureReadyForReview,
          NotificationType.ExpenditureReadyForFunding,
          NotificationType.ExpenditureReadyForRelease,
          NotificationType.ExpenditureCancelled,
          NotificationType.ExpenditureFinalized,
        ].includes(notificationType) && (
          <ExpenditureNotificationMessage
            actionTitle={actionTitle}
            actionMetadataDescription={actionMetadataDescription}
            loading={loadingColony || loadingAction || loadingExpenditure}
            notificationType={notificationType}
          />
        )}
    </NotificationWrapper>
  );
};

ExpenditureNotification.displayName = displayName;

export default ExpenditureNotification;
