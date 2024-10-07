import React, { useMemo, type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  type NotificationColonyFragment,
  useGetTokenFromEverywhereQuery,
} from '~gql';
import { COLONY_BALANCES_ROUTE } from '~routes';
import {
  NotificationType,
  type Notification as NotificationInterface,
} from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';
import { getNumeralTokenAmount } from '~utils/tokens.ts';

import NotificationMessage from '../NotificationMessage.tsx';
import NotificationWrapper from '../NotificationWrapper.tsx';

const displayName =
  'common.Extensions.UserHub.partials.FundsClaimedNotification';

interface FundsClaimedNotificationProps {
  colony: NotificationColonyFragment | null | undefined;
  loadingColony: boolean;
  notification: NotificationInterface;
}

const MSG = defineMessages({
  incomingFunds: {
    id: `${displayName}.incomingFunds`,
    defaultMessage: 'Incoming funds: {amount} {symbol} has been claimed.',
  },
  unknownClaim: {
    id: `${displayName}.unknownAction`,
    defaultMessage: 'Unknown claim',
  },
});

const FundsClaimedNotification: FC<FundsClaimedNotificationProps> = ({
  colony,
  loadingColony,
  notification,
}) => {
  const navigate = useNavigate();
  const { tokenAmount, tokenAddress } = notification.customAttributes || {};

  const { data: tokenData, loading: loadingToken } =
    useGetTokenFromEverywhereQuery({
      variables: { input: { tokenAddress: tokenAddress || '' } },
      skip: !tokenAddress,
    });

  const handleNotificationClicked = () => {
    if (colony) {
      navigate(`/${colony.name}/${COLONY_BALANCES_ROUTE}`);
    }
  };

  const message = useMemo(() => {
    const token = tokenData?.getTokenFromEverywhere?.items?.[0];

    if (
      !tokenAddress ||
      !tokenAmount ||
      !token ||
      !notification.customAttributes?.notificationType
    ) {
      return formatText(MSG.unknownClaim);
    }

    if (
      notification.customAttributes?.notificationType ===
      NotificationType.FundsClaimed
    ) {
      return formatText(MSG.incomingFunds, {
        amount: getNumeralTokenAmount(tokenAmount, token.decimals),
        symbol: token.symbol,
      });
    }

    return formatText(MSG.unknownClaim);
  }, [
    notification.customAttributes?.notificationType,
    tokenAddress,
    tokenAmount,
    tokenData,
  ]);

  return (
    <NotificationWrapper
      colony={colony}
      loadingColony={loadingColony}
      notification={notification}
      onClick={handleNotificationClicked}
    >
      <NotificationMessage loading={loadingColony || loadingToken}>
        {message}
      </NotificationMessage>
    </NotificationWrapper>
  );
};

FundsClaimedNotification.displayName = displayName;
export default FundsClaimedNotification;
