import { UsersThree } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import { DomainMetadata } from '~types';
import { formatText } from '~utils/intl';
import TeamBadge from '~v5/common/Pills/TeamBadge';

import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.TeamFromRow';

interface TeamFromRowProps {
  teamMetadata: DomainMetadata;
}

const TeamFromRow = ({ teamMetadata }: TeamFromRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.simplePayment.from',
          })}
        >
          <div className="flex items-center gap-2">
            <UsersThree size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.from' })}</span>
          </div>
        </Tooltip>
      </div>
      <div>
        <TeamBadge teamName={teamMetadata.name} />
      </div>
    </>
  );
};

TeamFromRow.displayName = displayName;
export default TeamFromRow;
