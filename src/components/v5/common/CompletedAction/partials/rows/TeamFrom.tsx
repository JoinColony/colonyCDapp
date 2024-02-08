import { UsersThree } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { ColonyActionType, type DomainMetadata } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import TeamBadge from '~v5/common/Pills/TeamBadge/index.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.TeamFromRow';

interface TeamFromRowProps {
  teamMetadata: DomainMetadata;
  actionType: ColonyActionType;
}

const TeamFromRow = ({ teamMetadata, actionType }: TeamFromRowProps) => {
  const getTooltipContent = () => {
    switch (actionType) {
      case ColonyActionType.SetUserRoles:
        return formatText({
          id: 'actionSidebar.tooltip.managePermissions.team',
        });
      default:
        return formatText({
          id: 'actionSidebar.tooltip.simplePayment.from',
        });
    }
  };
  const getRowTitle = () => {
    switch (actionType) {
      case ColonyActionType.SetUserRoles:
        return formatText({ id: 'actionSidebar.team' });
      default:
        return formatText({ id: 'actionSidebar.from' });
    }
  };

  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={getTooltipContent()}
        >
          <div className="flex items-center gap-2">
            <UsersThree size={ICON_SIZE} />
            <span>{getRowTitle()}</span>
          </div>
        </Tooltip>
      </div>
      <div>
        <TeamBadge name={teamMetadata.name} color={teamMetadata.color} />
      </div>
    </>
  );
};

TeamFromRow.displayName = displayName;
export default TeamFromRow;
