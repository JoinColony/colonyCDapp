import clsx from 'clsx';
import React, { useMemo, type FC } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { getActionTitleValues } from '~common/ColonyActions/helpers/index.ts';
import { useGetUserByAddressQuery, type ColonyActionFragment } from '~gql';
import { useAmountLessFee } from '~hooks/useAmountLessFee.ts';
import { NotificationType, type Notification } from '~types/notifications.ts';
import { formatText } from '~utils/intl.ts';

const displayName = 'common.Extensions.UserHub.partials.NotificationMessage';

interface NotificationMessageProps {
  action: ColonyActionFragment;
  notification: Notification;
}

const MSG = defineMessages({
  mention: {
    id: `${displayName}.mention`,
    defaultMessage: '{name} has mentioned you in: ',
  },
  someone: {
    id: `${displayName}.someone`,
    defaultMessage: 'Someone',
  },
});

const NotificationMessage: FC<NotificationMessageProps> = ({
  action,
  notification,
}) => {
  const { formatMessage } = useIntl();
  const amountLessFee = useAmountLessFee(action.amount, action.networkFee);
  const { data, loading } = useGetUserByAddressQuery({
    variables: { address: notification.customAttributes?.creator || '' },
    skip: !notification.customAttributes?.creator,
  });

  const creator = useMemo(() => {
    return data?.getUserByAddress?.items[0]?.profile?.displayName;
  }, [data]);

  const colony = useMemo(() => {
    const { nativeToken, metadata } = action.colony;

    return {
      nativeToken: {
        decimals: nativeToken.nativeTokenDecimals,
        symbol: nativeToken.nativeTokenSymbol,
        tokenAddress: nativeToken.tokenAddress,
        name: nativeToken.name,
      },
      metadata,
    };
  }, [action]);

  const actionMetadataDescription = formatMessage(
    { id: 'action.title' },
    getActionTitleValues({
      actionData: {
        ...action,
        amount: amountLessFee,
      },
      colony,
    }),
  );

  if (
    notification.customAttributes?.notificationType === NotificationType.Action
  ) {
    return (
      <p className="text-xs font-normal text-gray-600">
        {action.metadata?.customTitle && `${action.metadata?.customTitle}: `}
        {actionMetadataDescription}
      </p>
    );
  }

  if (
    notification.customAttributes?.notificationType === NotificationType.Mention
  ) {
    return (
      <p
        className={clsx('text-xs font-normal text-gray-600', {
          skeleton: loading,
        })}
      >
        {formatText(MSG.mention, {
          name: creator || formatText(MSG.someone),
        })}
        {action.metadata?.customTitle || actionMetadataDescription}
      </p>
    );
  }

  return (
    <p className="text-xs font-normal text-gray-600">
      {actionMetadataDescription}
    </p>
  );
};

NotificationMessage.displayName = displayName;

export default NotificationMessage;
