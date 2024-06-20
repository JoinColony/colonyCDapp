import { Scales } from '@phosphor-icons/react';
import React from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.DecisionMethodRow';

interface DecisionMethodRowProps {
  isMotion: boolean;
  decisionMethod?: DecisionMethod;
}

const DecisionMethodRow = ({
  isMotion,
  decisionMethod,
}: DecisionMethodRowProps) => {
  return (
    <ActionData
      rowLabel={formatText({ id: 'actionSidebar.decisionMethod' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.decisionMethod',
      })}
      RowIcon={Scales}
      rowContent={
        decisionMethod ||
        (isMotion ? DecisionMethod.Reputation : DecisionMethod.Permissions)
      }
    />
  );
};

DecisionMethodRow.displayName = displayName;
export default DecisionMethodRow;
