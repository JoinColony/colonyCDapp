import React, { useMemo, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import useGetActionTitleValues from '~common/ColonyActions/helpers/getActionTitleValues.ts';
import {
  type NotificationColonyFragment,
  NotificationType,
  useGetColonyActionQuery,
  useGetExpenditureQuery,
  ColonyActionType,
  useGetUserByAddressQuery,
} from '~gql';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { TX_SEARCH_PARAM } from '~routes';
import { type Notification as NotificationInterface } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';

import { MentionNotificationMessage } from '../Action/MentionNotificationMessage.tsx';
import NotificationWrapper from '../NotificationWrapper.tsx';

import ExpenditureFundingMotionNotificationMessage from './ExpenditureFundingMotionNotificationMessage.tsx';
import ExpenditureFundingMultiSigNotificationMessage from './ExpenditureFundingMultiSigNotificationMessage.tsx';
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
  const { networkInverseFee } = useNetworkInverseFee();
  const navigate = useNavigate();

  const {
    creator,
    expenditureID,
    notificationType,
    transactionHash: notificationTransactionHash,
  } = notification.customAttributes || {};

  const { data: userData, loading: loadingUser } = useGetUserByAddressQuery({
    variables: { address: creator || '' },
    skip: !creator,
  });

  const isExpenditureNotification =
    !!notificationType &&
    [
      NotificationType.ExpenditureReadyForReview,
      NotificationType.ExpenditureReadyForFunding,
      NotificationType.ExpenditureReadyForRelease,
      NotificationType.ExpenditureCancelled,
      NotificationType.ExpenditureFinalized,
      NotificationType.ExpenditurePayoutClaimed,
    ].includes(notificationType);

  const isExpenditureMotionNotification =
    !!notificationType &&
    [
      NotificationType.MotionCreated,
      NotificationType.MotionOpposed,
      NotificationType.MotionSupported,
      NotificationType.MotionVoting,
      NotificationType.MotionReveal,
      NotificationType.MotionFinalized,
    ].includes(notificationType);

  const isExpenditureMultiSigNotification =
    !!notificationType &&
    [
      NotificationType.MultisigActionCreated,
      NotificationType.MultisigActionApproved,
      NotificationType.MultisigActionRejected,
      NotificationType.MultisigActionFinalized,
    ].includes(notificationType);

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

  const { data: notificationActionData, loading: loadingNotificationAction } =
    useGetColonyActionQuery({
      variables: {
        transactionHash: notificationTransactionHash || '',
      },
      skip:
        !notificationTransactionHash ||
        notificationTransactionHash === transactionHash,
    });

  const notificationAction = notificationActionData?.getColonyAction;

  let isExpenditureFundingMotionNotification = isExpenditureMotionNotification;
  let isExpenditureFundingMultiSigNotification =
    isExpenditureMultiSigNotification;

  if (notificationTransactionHash !== transactionHash) {
    isExpenditureFundingMotionNotification =
      isExpenditureFundingMotionNotification &&
      notificationAction?.type === ColonyActionType.FundExpenditureMotion;

    isExpenditureFundingMultiSigNotification =
      isExpenditureFundingMultiSigNotification &&
      notificationAction?.type === ColonyActionType.FundExpenditureMultisig;
  }

  const loading =
    loadingColony ||
    loadingAction ||
    loadingNotificationAction ||
    loadingExpenditure;

  const handleNotificationClicked = () => {
    if (!transactionHash) {
      return;
    }

    const path = isCurrentColony
      ? window.location.pathname
      : `/${colony?.name}`;

    navigate(
      setQueryParamOnUrl({
        path,
        params: {
          [TX_SEARCH_PARAM]: transactionHash,
        },
      }),
      {
        replace: true,
      },
    );
  };

  const actionTitle = action?.metadata?.customTitle || '';

  const actionTitleValues = useGetActionTitleValues({
    actionData: action,
    colony: colony
      ? {
          nativeToken: colony?.nativeToken,
          metadata: colony?.metadata,
        }
      : undefined,
    expenditureData: expenditure ?? undefined,
    networkInverseFee,
  });

  const actionMetadataDescription = useMemo(() => {
    if (!action || !colony) {
      return null;
    }

    return formatText(
      { id: 'action.title' },
      actionTitleValues,
      notification.id,
    );
  }, [action, actionTitleValues, colony, notification.id]);

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      {notificationType === NotificationType.Mention && (
        <MentionNotificationMessage
          actionMetadataDescription={actionMetadataDescription}
          actionTitle={actionTitle}
          creator={
            userData?.getUserByAddress?.items[0]?.profile?.displayName ?? ''
          }
          loading={loadingColony || loadingAction || loadingUser}
          notificationType={notificationType}
        />
      )}
      {isExpenditureNotification && (
        <ExpenditureNotificationMessage
          actionTitle={actionTitle}
          actionMetadataDescription={actionMetadataDescription}
          loading={loading}
          notificationType={notificationType}
        />
      )}
      {isExpenditureFundingMotionNotification && (
        <ExpenditureFundingMotionNotificationMessage
          actionTitle={actionTitle}
          actionMetadataDescription={actionMetadataDescription}
          loading={loading}
          notificationType={notificationType as NotificationType}
        />
      )}
      {isExpenditureFundingMultiSigNotification && (
        <ExpenditureFundingMultiSigNotificationMessage
          actionTitle={actionTitle}
          actionMetadataDescription={actionMetadataDescription}
          loading={loading}
          notificationType={notificationType as NotificationType}
        />
      )}
    </NotificationWrapper>
  );
};

ExpenditureNotification.displayName = displayName;

export default ExpenditureNotification;
