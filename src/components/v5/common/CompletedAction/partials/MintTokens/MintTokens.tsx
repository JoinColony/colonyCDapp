import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  AMOUNT_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
  TOKEN_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import { useDecisionMethod } from '~v5/common/CompletedAction/hooks.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionTypeRow,
  AmountRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';
import { getFormattedTokenAmount } from '../utils.ts';

const displayName = 'v5.common.CompletedAction.partials.MintTokens';

interface MintTokensProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Minting new tokens',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Mint {amount} {token} by {user}',
  },
});

const MintTokens = ({ action }: MintTokensProps) => {
  const decisionMethod = useDecisionMethod(action);
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { amount, initiatorUser, token, transactionHash, annotation } = action;

  const formattedAmount = getFormattedTokenAmount(
    amount || '1',
    token?.decimals,
  );
  const convertedValue = convertToDecimal(
    amount || '',
    getTokenDecimalsWithFallback(token?.decimals),
  );

  const metadata =
    action.motionData?.motionDomain.metadata ??
    action.multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          transactionHash={transactionHash}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [ACTION_TYPE_FIELD_NAME]: Action.MintTokens,
            [AMOUNT_FIELD_NAME]: convertedValue?.toString(),
            [TOKEN_FIELD_NAME]: token?.tokenAddress,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
      </div>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          amount: formattedAmount,
          token: action.token?.symbol,
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

        <AmountRow
          amount={action.amount || '1'}
          token={action.token || undefined}
        />

        <DecisionMethodRow action={action} />

        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

MintTokens.displayName = displayName;
export default MintTokens;
