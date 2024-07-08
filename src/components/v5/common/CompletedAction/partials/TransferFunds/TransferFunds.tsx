import { ArrowDownRight } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import {
  getNumeralTokenAmount,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import {
  AMOUNT_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  FROM_FIELD_NAME,
  TITLE_FIELD_NAME,
  TOKEN_FIELD_NAME,
  TO_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

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

const displayName = 'v5.common.CompletedAction.partials.TransferFunds';

interface TransferFundsProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Transfer funds',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'Move {amount} {token} from {fromDomain} to {toDomain} by {user}',
  },
});

const TransferFunds = ({ action }: TransferFundsProps) => {
  const decisionMethod = useDecisionMethod(action);
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    amount,
    initiatorUser,
    token,
    transactionHash,
    fromDomain,
    toDomain,
    isMotion,
    motionData,
    annotation,
  } = action;

  const formattedAmount = getNumeralTokenAmount(amount || '1', token?.decimals);
  const convertedValue = convertToDecimal(
    amount || '',
    getTokenDecimalsWithFallback(token?.decimals),
  );

  const motionDomain = motionData?.motionDomain ?? null;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          action={Action.TransferFunds}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [FROM_FIELD_NAME]: fromDomain?.nativeId,
            [TO_FIELD_NAME]: toDomain?.nativeId,
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
          fromDomain: action.fromDomain?.metadata?.name,
          toDomain: action.toDomain?.metadata?.name,
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
          rowLabel={formatText({ id: 'actionSidebar.to' })}
          rowContent={
            action.toDomain?.metadata?.name ? (
              <TeamBadge
                name={action.toDomain?.metadata?.name}
                color={action.toDomain?.metadata?.color}
              />
            ) : null
          }
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.transferFunds.to',
          })}
          RowIcon={ArrowDownRight}
        />

        <AmountRow
          amount={action.amount || '1'}
          token={action.token || undefined}
        />

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

TransferFunds.displayName = displayName;
export default TransferFunds;
