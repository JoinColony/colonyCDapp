import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import Numeral from '~shared/Numeral/Numeral.tsx';
import { ColonyActionType } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { getSelectedToken } from '~utils/tokens.ts';

import {
  ONE_DAY_IN_SECONDS,
  OPTIONS,
} from '../../AmountPerPeriodRow/consts.ts';
import { type StreamingPaymentFormValues } from '../../forms/StreamingPaymentForm/hooks.ts';
import { getInterval } from '../../forms/StreamingPaymentForm/utils.ts';

import CurrentUser from './CurrentUser.tsx';
import RecipientUser from './RecipientUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.StreamingPaymentDescription';

export const StreamingPaymentDescription = () => {
  const { colony } = useColonyContext();
  const formValues = useFormContext<StreamingPaymentFormValues>().getValues();
  const { amount, recipient, tokenAddress, period } = formValues;

  if (!amount || !tokenAddress) {
    return (
      <FormattedMessage
        id="streamingPayment.description.placeholder"
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  const recipientUser = recipient ? (
    <RecipientUser userAddress={recipient} />
  ) : (
    formatText({
      id: 'actionSidebar.metadataDescription.recipient',
    })
  );

  const selectedToken = getSelectedToken(colony, tokenAddress);
  const interval = getInterval(period);

  return (
    <FormattedMessage
      id="action.title"
      values={{
        actionType: ColonyActionType.CreateStreamingPayment,
        tokenSymbol: selectedToken
          ? selectedToken.symbol
          : formatText({
              id: 'actionSidebar.metadataDescription.tokens',
            }),
        recipient: recipientUser,
        amount: <Numeral value={amount} />,
        period:
          period && interval
            ? OPTIONS[0].options.find(({ value }) => value === period.interval)
                ?.label ||
              formatText(
                { id: 'streamingPayment.description.days' },
                {
                  days: interval / ONE_DAY_IN_SECONDS,
                },
              )
            : formatText({
                id: 'actionSidebar.amountPer.options.week',
              }).toLowerCase(),
        initiator: <CurrentUser />,
      }}
    />
  );
};

StreamingPaymentDescription.displayName = displayName;
export default StreamingPaymentDescription;
