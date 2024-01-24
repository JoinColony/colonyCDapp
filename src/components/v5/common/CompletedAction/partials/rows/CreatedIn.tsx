import { HouseLine } from 'phosphor-react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip';
import { DomainMetadata } from '~types/graphql';
import { formatText } from '~utils/intl';
import TeamBadge from '~v5/common/Pills/TeamBadge';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.CreatedInRow';

interface CreatedInRowProps {
  motionDomainMetadata: DomainMetadata;
}

const CreatedInRow = ({ motionDomainMetadata }: CreatedInRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
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
        <TeamBadge name={motionDomainMetadata.name} />
      </div>
    </>
  );
};

CreatedInRow.displayName = displayName;
export default CreatedInRow;
