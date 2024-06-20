import { Scales } from '@phosphor-icons/react';
import React from 'react';

import { type ColonyAction, ColonyActionType } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';

import ActionData from './ActionData.tsx';

const displayName = 'v5.common.CompletedAction.partials.DecisionMethodRow';

interface DecisionMethodRowProps {
  action: ColonyAction;
}

const DecisionMethodRow = ({ action }: DecisionMethodRowProps) => {
  const getRowContent = () => {
    if (action.isMultiSig) {
      return formatText({ id: 'decisionMethod.multiSig' });
    }
    if (action.isMotion) {
      return formatText({ id: 'decisionMethod.reputation' });
    }
    if (
      action.type === ColonyActionType.CreateExpenditure &&
      action.expenditure?.isStaked
    ) {
      return formatText({ id: 'decisionMethod.staking' });
    }
    return formatText({ id: 'decisionMethod.permissions' });
  };

  return (
    <ActionData
      rowLabel={formatText({ id: 'actionSidebar.decisionMethod' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.decisionMethod',
      })}
      RowIcon={Scales}
      rowContent={getRowContent()}
    />
  );
};

DecisionMethodRow.displayName = displayName;
export default DecisionMethodRow;
