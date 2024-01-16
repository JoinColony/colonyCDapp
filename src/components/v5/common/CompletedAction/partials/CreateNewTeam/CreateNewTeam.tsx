import { PaintBucket, Rocket, UserList } from 'phosphor-react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip';
import { ColonyAction } from '~types';
import { formatText } from '~utils/intl';
import TeamColourBadge from '~v5/common/ActionSidebar/partials/TeamColourField/partials/TeamColourBadge';
import UserPopover from '~v5/shared/UserPopover';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks';
import {
  ActionTypeRow,
  CreatedInRow,
  DecisionMethodRow,
  DescriptionRow,
} from '../rows';

const displayName = 'v5.common.CompletedAction.partials.CreateNewTeam';

interface CreateNewTeamProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Create a new team',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage: 'New team {team} by {user}',
  },
});

const CreateNewTeam = ({ action }: CreateNewTeamProps) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        {formatText(MSG.subtitle, {
          team: action.fromDomain?.metadata?.name,
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
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.name',
            })}
          >
            <div className="flex items-center gap-2">
              <UserList size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.teamName' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <span>{action.fromDomain?.metadata?.name}</span>
        </div>

        <div>
          <Tooltip
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.purpose',
            })}
          >
            <div className="flex items-center gap-2">
              <Rocket size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.teamPurpose' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <span>{action.fromDomain?.metadata?.description}</span>
        </div>

        <div>
          <Tooltip
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText({
              id: 'actionSidebar.tooltip.createNewTeam.team.colour',
            })}
          >
            <div className="flex items-center gap-2">
              <PaintBucket size={ICON_SIZE} />
              <span>{formatText({ id: 'actionSidebar.teamColour' })}</span>
            </div>
          </Tooltip>
        </div>
        <div>
          <TeamColourBadge
            defaultColor={action.fromDomain?.metadata?.color}
            title={action.fromDomain?.metadata?.name || 'Team'}
          />
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
      </ActionDataGrid>
    </>
  );
};

CreateNewTeam.displayName = displayName;
export default CreateNewTeam;
