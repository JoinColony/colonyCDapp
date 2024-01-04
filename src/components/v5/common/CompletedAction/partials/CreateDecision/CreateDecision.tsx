import React from 'react';

import { defineMessages } from 'react-intl';
import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import { formatText } from '~utils/intl';
import UserPopover from '~v5/shared/UserPopover';

const displayName = 'v5.common.CompletedAction.partials.CreateDecision';

interface CreateDecisionProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Create decision',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Decision by {user}',
  },
});

const CreateDecision = ({ action }: CreateDecisionProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          user: initiatorUser ? (
            <UserPopover
              userName={initiatorUser.profile?.displayName}
              walletAddress={initiatorUser.walletAddress}
              user={initiatorUser}
              withVerifiedBadge={false}
            >
              {initiatorUser.profile?.displayName}
            </UserPopover>
          ) : null,
        })}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}
      </ActionDataGrid>
    </>
  );
};

CreateDecision.displayName = displayName;
export default CreateDecision;
