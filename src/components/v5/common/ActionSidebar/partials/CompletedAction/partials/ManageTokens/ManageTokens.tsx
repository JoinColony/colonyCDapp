import React from 'react';

import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

import TokensTable from './partials/TokensTable/TokensTable.tsx';

const displayName = 'v5.common.CompletedAction.partials.ManageTokens';

interface ManageTokensProps {
  action: ColonyAction;
}

const ManageTokens = ({ action }: ManageTokensProps) => {
  const {
    customTitle = formatText(
      {
        id: 'action.type',
      },
      {
        actionType: ColonyActionType.ManageTokens,
      },
    ),
  } = action?.metadata || {};

  const { initiatorUser, approvedTokenChanges } = action;

  const metadata =
    action.motionData?.motionDomain.metadata ??
    action.multiSigData?.multiSigDomain.metadata;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(
          {
            id: 'action.title',
          },
          {
            actionType: ColonyActionType.ManageTokens,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />
        <DecisionMethodRow action={action} />

        {metadata && <CreatedInRow motionDomainMetadata={metadata} />}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      {approvedTokenChanges !== undefined && approvedTokenChanges !== null && (
        <TokensTable approvedTokenChanges={approvedTokenChanges} />
      )}
    </>
  );
};

ManageTokens.displayName = displayName;
export default ManageTokens;
