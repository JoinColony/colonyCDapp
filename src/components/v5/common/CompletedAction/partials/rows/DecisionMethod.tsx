import { Scales } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.DecisionMethodRow';

interface DecisionMethodRowProps {
  isMotion: boolean;
}

const DecisionMethodRow = ({ isMotion }: DecisionMethodRowProps) => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={formatText({
            id: 'actionSidebar.tooltip.decisionMethod',
          })}
        >
          <div className="flex items-center gap-2">
            <Scales size={ICON_SIZE} />
            <span>{formatText({ id: 'actionSidebar.decisionMethod' })}</span>
          </div>
        </Tooltip>
      </div>
      <div>
        {isMotion ? DecisionMethod.Reputation : DecisionMethod.Permissions}
      </div>
    </>
  );
};

DecisionMethodRow.displayName = displayName;
export default DecisionMethodRow;
