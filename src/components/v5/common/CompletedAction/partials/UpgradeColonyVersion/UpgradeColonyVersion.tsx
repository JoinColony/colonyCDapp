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

const displayName = 'v5.common.CompletedAction.partials.UpgradeColonyVersion';

interface UpgradeColonyVersionProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Updating the Colony version',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Upgrade Colony version by {user}',
  },
});

// @TODO connect actual version number
const UpgradeColonyVersion = ({ action }: UpgradeColonyVersionProps) => {
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
        Upgrade colony version by {action.initiatorUser?.profile?.displayName}
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

UpgradeColonyVersion.displayName = displayName;
export default UpgradeColonyVersion;
