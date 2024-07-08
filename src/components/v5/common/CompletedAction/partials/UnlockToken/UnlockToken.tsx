import { CoinVertical } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import {
  CREATED_IN_FIELD_NAME,
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
  ActionData,
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.UnlockToken';

interface UnlockTokenProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Unlocking a native token',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Unlocking tokens by {user}',
  },
});

const UnlockToken = ({ action }: UnlockTokenProps) => {
  const decisionMethod = useDecisionMethod(action);
  const { colony } = useColonyContext();
  const { nativeToken } = colony;
  const { name, symbol } = nativeToken;
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const {
    annotation,
    initiatorUser,
    motionData,
    multiSigData,
    transactionHash,
    token,
    type: actionType,
  } = action;

  const metadata =
    motionData?.motionDomain.metadata ?? multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={transactionHash}
          action={Action.UnlockToken}
          defaultValues={{
            [TITLE_FIELD_NAME]: customTitle,
            [TOKEN_FIELD_NAME]: token?.tokenAddress,
            [DECISION_METHOD_FIELD_NAME]: decisionMethod,
            [CREATED_IN_FIELD_NAME]: multiSigData?.multiSigDomain?.nativeId,
            [DESCRIPTION_FIELD_NAME]: annotation?.message,
          }}
        />
      </div>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
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
        <ActionTypeRow actionType={actionType} />

        <ActionData
          rowLabel={formatText({ id: 'actionSidebar.token' })}
          rowContent={`${name} (${symbol})`}
          RowIcon={CoinVertical}
        />

        <DecisionMethodRow action={action} />

        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {annotation?.message && (
        <DescriptionRow description={annotation.message} />
      )}
    </>
  );
};

UnlockToken.displayName = displayName;
export default UnlockToken;
