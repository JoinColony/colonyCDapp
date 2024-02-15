import { PaintBucket, Rocket, UserList } from '@phosphor-icons/react';
import React from 'react';
import { defineMessages } from 'react-intl';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamColourBadge from '~v5/common/ActionSidebar/partials/TeamColorField/partials/TeamColorBadge.tsx';
import UserPopover from '~v5/shared/UserPopover/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';
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

const displayName = 'v5.common.CompletedAction.partials.ManageTeam';

interface CreateNewTeamProps {
  action: ColonyAction;
}

const MSG = defineMessages({
  newTeamTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Create a new team',
  },
  editTeamTitle: {
    id: `${displayName}.editTitle`,
    defaultMessage: 'Edit a team',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      '{isAddingNewTeam, select, true {New team {team} by {user}} other {Change {team} team details by {user}}}',
  },
});

const ManageTeam = ({ action }: CreateNewTeamProps) => {
  const isAddingNewTeam = action.type.includes(ColonyActionType.CreateDomain);
  const {
    customTitle = formatText(
      isAddingNewTeam ? MSG.newTeamTitle : MSG.editTeamTitle,
    ),
  } = action?.metadata || {};
  const { initiatorUser } = action;

  const actionDomainMetadata =
    action.pendingDomainMetadata || action.fromDomain?.metadata;
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
          isAddingNewTeam,
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
          <span>{actionDomainMetadata?.name}</span>
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
          <span className="break-word">
            {actionDomainMetadata?.description}
          </span>
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
            defaultColor={actionDomainMetadata?.color}
            title={actionDomainMetadata?.name || 'Team'}
          />
        </div>

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

ManageTeam.displayName = displayName;
export default ManageTeam;
