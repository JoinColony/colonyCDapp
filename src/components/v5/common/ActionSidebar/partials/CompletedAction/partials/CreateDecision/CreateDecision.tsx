import React from 'react';
import { defineMessages } from 'react-intl';

import { type ActionData } from '~actions/index.ts';
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
  actionData: ActionData;
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

const CreateDecision = ({ actionData }: CreateDecisionProps) => {
  const { title = formatText(MSG.defaultTitle) } =
    actionData?.decisionData || {};
  const { initiatorUser } = actionData;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <ActionTitle>{title}</ActionTitle>
        <MeatballMenu
          showRedoItem={false}
          transactionHash={actionData.transactionHash}
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
        <ActionTypeRow actionType={actionData.type} />

        <DecisionMethodRow
          isMotion={actionData.isMotion || false}
          isMultisig={actionData.isMultiSig || false}
        />

        {actionData.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={actionData.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {actionData.decisionData?.description && (
        <DescriptionRow description={actionData.decisionData.description} />
      )}
    </>
  );
};

CreateDecision.displayName = displayName;
export default CreateDecision;
