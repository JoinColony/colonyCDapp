import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { DecisionMethod } from '~types/actions.ts';
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
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import MultiSigMeatballMenu from '../MultiSigMeatballMenu/MultiSigMeatballMenu.tsx';
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
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    amount,
    initiatorUser,
    token,
    transactionHash,
    isMotion,
    isMultiSig,
    annotation,
    multiSigData,
  } = action;

  const formattedAmount = getFormattedTokenAmount(
    amount || '1',
    token?.decimals,
  );
  const convertedValue = convertToDecimal(
    amount || '',
    getTokenDecimalsWithFallback(token?.decimals),
  );

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        {isMultiSig ? (
          <MultiSigMeatballMenu
            transactionHash={transactionHash}
            multiSigData={multiSigData}
          />
        ) : (
          <MeatballMenu
            transactionHash={transactionHash}
            defaultValues={{
              [TITLE_FIELD_NAME]: customTitle,
              [ACTION_TYPE_FIELD_NAME]: Action.MintTokens,
              [AMOUNT_FIELD_NAME]: convertedValue?.toString(),
              [TOKEN_FIELD_NAME]: token?.tokenAddress,
              [DECISION_METHOD_FIELD_NAME]: isMotion
                ? DecisionMethod.Reputation
                : DecisionMethod.Permissions,
              [DESCRIPTION_FIELD_NAME]: annotation?.message,
            }}
          />
        )}
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

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
    </>
  );
};

MintTokens.displayName = displayName;
export default MintTokens;
