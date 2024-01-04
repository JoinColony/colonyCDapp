import React from 'react';

import { PencilCircle } from 'phosphor-react';
import { defineMessages } from 'react-intl';
import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { ICON_SIZE } from '../../consts';
import UserPopover from '~v5/shared/UserPopover';

const displayName = 'v5.common.CompletedAction.partials.EditColonyDetails';

interface EditColonyDetailsProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: "Updating the Colony's details",
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'Colony details updated by {user}',
  },
});

const EditColonyDetails = ({ action }: EditColonyDetailsProps) => {
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

        <div>
          <Tooltip
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.editColony.colonyName',
            })}
          >
            <div className="flex items-center gap-2">
              <PencilCircle size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.colonyName' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <span>{action.colony.metadata?.displayName}</span>
        </div>

        <DecisionMethodRow isMotion={action.isMotion || false} />

        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}

        {action.annotation?.message && (
          <DescriptionRow description={action.annotation.message} />
        )}

        {/* @TODO implement social links table display */}
      </ActionDataGrid>
    </>
  );
};

EditColonyDetails.displayName = displayName;
export default EditColonyDetails;
