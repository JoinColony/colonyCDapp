import { Scales } from '@phosphor-icons/react';
import React from 'react';

import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';

import ActionData from './ActionData.tsx';

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
      return DecisionMethod.MultiSig;
    }
    if (isMotion) {
      return DecisionMethod.Reputation;
    }
    return DecisionMethod.Permissions;
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
