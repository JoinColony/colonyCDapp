import React from 'react';
import { Scales } from 'phosphor-react';
import Tooltip from '~shared/Extensions/Tooltip';
import { formatText } from '~utils/intl';
import { DecisionMethod } from '~v5/common/ActionSidebar/hooks';
import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.DecisionMethodRow';

interface DecisionMethodRowProps {
  isMotion: boolean;
}

const DecisionMethodRow = ({ isMotion }: DecisionMethodRowProps) => {
  return (
    <>
      <div>
        <Tooltip
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
