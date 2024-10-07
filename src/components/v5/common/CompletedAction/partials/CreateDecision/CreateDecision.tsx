import React from 'react';
import { defineMessages } from 'react-intl';

import { type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import UserInfoPopover from '~v5/shared/UserInfoPopover/index.ts';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import MeatballMenu from '../MeatballMenu/MeatballMenu.tsx';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows/index.ts';

const displayName = 'v5.common.CompletedAction.partials.CreateDecision';

interface CreateDecisionProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Create agreement',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Agreement by {user}',
  },
});

const CreateDecision = ({ action }: CreateDecisionProps) => {
  const { title = formatText(MSG.defaultTitle) } = action?.decisionData || {};
  const { initiatorUser } = action;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{title}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={action.transactionHash}
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
        <ActionTypeRow actionType={action.type} />

        <DecisionMethodRow action={action} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.decisionData?.description && (
        <DescriptionRow description={action.decisionData.description} />
      )}
    </>
  );
};

CreateDecision.displayName = displayName;
export default CreateDecision;
