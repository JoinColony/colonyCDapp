import React from 'react';
import { HouseLine } from 'phosphor-react';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { ICON_SIZE } from '../../consts';
import { DomainMetadata } from '~types';
import TeamBadge from '~v5/common/Pills/TeamBadge';

const displayName = 'v5.common.CompletedAction.partials.CreatedInRow';

interface CreatedInRowProps {
  motionDomainMetadata: DomainMetadata;
}

const CreatedInRow = ({ motionDomainMetadata }: CreatedInRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.createdIn',
          })}
        >
          <div className="flex items-center gap-2">
            <HouseLine size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.createdIn' })}</span>
          </div>
        </Tooltip>
      </div>
      <div>
        <TeamBadge teamName={motionDomainMetadata.name} />
      </div>
    </>
  );
};

CreatedInRow.displayName = displayName;
export default CreatedInRow;
