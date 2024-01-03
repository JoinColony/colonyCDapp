import React from 'react';

import { PaintBucket, Rocket, UserList } from 'phosphor-react';
import { ColonyAction } from '~types';

import CreatedInRow from '../rows/CreatedInRow';
import DecisionMethodRow from '../rows/DecisionMethod';
import ActionTypeRow from '../rows/ActionType';
import DescriptionRow from '../rows/Description';
import { ActionDataGrid, ActionSubtitle, ActionTitle } from '../Blocks/Blocks';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { ICON_SIZE } from '../../consts';
import TeamColourBadge from '~v5/common/ActionSidebar/partials/TeamColourField/partials/TeamColourBadge';

const displayName = 'v5.common.CompletedAction.partials.CreateNewTeam';

interface CreateNewTeamProps {
  action: ColonyAction;
}

const CreateNewTeam = ({ action }: CreateNewTeamProps) => {
  const { customTitle = 'Create decision' } = action?.metadata || {};

  return (
    <>
      <ActionTitle>{customTitle}</ActionTitle>
      <ActionSubtitle>
        Create new team {action.fromDomain?.metadata?.name} by{' '}
        {action.initiatorUser?.profile?.displayName}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={action.type} />

        <div>
          <Tooltip
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
