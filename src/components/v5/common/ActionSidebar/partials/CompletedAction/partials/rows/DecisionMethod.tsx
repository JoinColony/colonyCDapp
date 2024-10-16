import { Scales } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.DecisionMethodRow';

interface DecisionMethodRowProps {
  isMotion: boolean;
  isMultisig: boolean;
}

const DecisionMethodRow = ({
  isMotion,
  isMultisig,
}: DecisionMethodRowProps) => {
  const getRowContent = () => {
    if (isMultisig) {
      return formatText({ id: 'decisionMethod.multiSig' });
    }
    if (isMotion) {
      return formatText({ id: 'decisionMethod.reputation' });
    }
    return formatText({ id: 'decisionMethod.permissions' });
  };

  return (
    <ActionContent
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
