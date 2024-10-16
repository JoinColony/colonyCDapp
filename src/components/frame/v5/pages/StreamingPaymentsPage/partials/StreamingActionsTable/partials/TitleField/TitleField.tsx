import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useMobile } from '~hooks';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { formatText } from '~utils/intl.ts';
import { getAmountPerValue } from '~utils/streamingPayments.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';

interface TitleFieldProps {
  tokenSymbol: string;
  amount: string;
  period: string;
  recipient: string;
  initiator: string;
  title: string;
  decimals: number;
  hideDescription: boolean;
}

const displayName =
  'pages.StreamingPaymentsPage.partials.StreamingActionsTable.partials.TitleField';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage:
      'Stream {amount} {tokenSymbol} / {period} to {recipient} by {initiator}',
  },
});

const TitleField: FC<TitleFieldProps> = ({
  tokenSymbol,
  amount,
  initiator,
  period,
  recipient,
  title,
  decimals,
  hideDescription,
}) => {
  const isMobile = useMobile();
  const { user: recipientUser, loading: isRecipientLoading } = useUserByAddress(
    recipient,
    true,
  );
  const { user: initiatorUser, loading: isInitiatorLoading } = useUserByAddress(
    initiator,
    true,
  );

  return (
    <div className="flex flex-col gap-[0.125rem]">
      <p className="text-1">{title}</p>
      {isMobile && hideDescription && (
        <p className="text-sm text-gray-600">
          {formatText(MSG.title, {
            amount: getFormattedTokenValue(
              amount,
              getTokenDecimalsWithFallback(decimals, DEFAULT_TOKEN_DECIMALS),
            ),
            tokenSymbol,
            period: period || 0,
            recipient: isRecipientLoading
              ? ''
              : recipientUser?.profile?.displayName,
            initiator: isInitiatorLoading
              ? ''
              : initiatorUser?.profile?.displayName,
          })}
        </p>
      )}
      <p className="hidden text-sm text-gray-600 sm:block">
        {formatText(MSG.title, {
          amount: getFormattedTokenValue(
            amount,
            getTokenDecimalsWithFallback(decimals, DEFAULT_TOKEN_DECIMALS),
          ),
          tokenSymbol,
          period: getAmountPerValue(period).toLowerCase(),
          recipient: isRecipientLoading
            ? ''
            : recipientUser?.profile?.displayName,
          initiator: isInitiatorLoading
            ? ''
            : initiatorUser?.profile?.displayName,
        })}
      </p>
    </div>
  );
};

export default TitleField;
