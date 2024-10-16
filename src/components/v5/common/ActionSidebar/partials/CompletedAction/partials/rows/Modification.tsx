import { ArrowsOutLineVertical } from '@phosphor-icons/react';
import React from 'react';

import { formatText } from '~utils/intl.ts';

import ActionContent from './ActionContent.tsx';

const displayName = 'v5.common.CompletedAction.partials.Modification';

interface ModificationProps {
  isSmite: boolean;
}

const Modification = ({ isSmite }: ModificationProps) => {
  return (
    <ActionContent
      rowLabel={formatText({ id: 'actionSidebar.modification' })}
      tooltipContent={formatText({
        id: 'actionSidebar.tooltip.manageReputation.modification',
      })}
      RowIcon={ArrowsOutLineVertical}
      rowContent={formatText({
        id: `actionSidebar.modification.${
          isSmite ? 'removeReputation' : 'awardReputation'
        }`,
      })}
    />
  );
};

Modification.displayName = displayName;
export default Modification;
