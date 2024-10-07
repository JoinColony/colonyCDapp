import { UserFocus } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { ADDRESS_ZERO } from '~constants';
import { Action } from '~constants/actions.ts';
import { useAmountLessFee } from '~hooks/useAmountLessFee.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import { splitWalletAddress } from '~utils/splitWalletAddress.ts';
import {
  getNumeralTokenAmount,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  FROM_FIELD_NAME,
  RECIPIENT_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  TITLE_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TOKEN_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionData,
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
  TeamFromRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.SimplePayment';

interface SimplePaymentProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Simple payment',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Pay {recipient} {amount} {token} by {user}',
  },
});

const SimplePayment = ({ action }: SimplePaymentProps) => {
  const decisionMethod = useDecisionMethod(action);
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    amount,
    networkFee,
    initiatorUser,
    recipientAddress: actionRecipientAddress = '',
    recipientUser: actionRecipientUser,
    token,
    transactionHash,
    fromDomain,
    isMotion,
    motionData,
    annotation,
  } = action;

  const amountLessFee = useAmountLessFee(amount, networkFee);

  const formattedAmount = getNumeralTokenAmount(amountLessFee, token?.decimals);
  const convertedValue = convertToDecimal(
    amountLessFee,
    getTokenDecimalsWithFallback(token?.decimals),
  );

  const { user } = useUserByAddress(actionRecipientAddress ?? '', true);
  const recipientAddress = user?.walletAddress ?? actionRecipientAddress;
  const recipientUser = user ?? actionRecipientUser;

  const motionDomain = motionData?.motionDomain ?? null;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
            [FROM_FIELD_NAME]: fromDomain?.nativeId,
            [RECIPIENT_FIELD_NAME]: recipientAddress,
            [AMOUNT_FIELD_NAME]: convertedValue?.toString(),
            [TOKEN_FIELD_NAME]: token?.tokenAddress,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [CREATED_IN_FIELD_NAME]: isMotion
              ? motionDomain?.nativeId
              : fromDomain?.nativeId,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
      </div>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: formattedAmount,
          token: action.token?.symbol,
          recipient: recipientAddress ? (
            <UserInfoPopover
              walletAddress={recipientAddress}
              user={recipientUser}
              withVerifiedBadge={false}
            >
              {recipientUser?.profile?.displayName ||
                splitWalletAddress(recipientAddress)}
            </UserInfoPopover>
          ) : null,
          user: initiatorUser ? (
            <UserInfoPopover
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserInfoPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        {action.fromDomain?.metadata && (
          <TeamFromRow
            teamMetadata={action.fromDomain.metadata}
            actionType={action.type}
          />
        )}
        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.recipient' })}
          rowContent={
            <UserPopover
              walletAddress={recipientAddress || ADDRESS_ZERO}
              size={20}
            />
          }
          RowIcon={UserFocus}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.recipient',
          })}
        />
        <AmountRow amount={amountLessFee} token={action.token || undefined} />

        <DecisionMethodRow action={action} />

        {!!motionDomain?.metadata && (
          <CreatedInRow motionDomainMetadata={motionDomain.metadata} />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

SimplePayment.displayName = displayName;
export default SimplePayment;
