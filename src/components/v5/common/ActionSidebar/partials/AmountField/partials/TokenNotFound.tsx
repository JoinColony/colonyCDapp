import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';

export const TokenNotFound = () => {
  return (
    <Tooltip
      trigger="hover"
      popperOptions={{ placement: 'bottom' }}
      tooltipContent={formatText({ id: 'actionSidebar.tokenErrorTooltip' })}
    >
      <div className="flex items-center gap-1 text-negative-400">
        <WarningCircle size={16} />
        <span className="text-md">
          {formatText({
            id: 'actionSidebar.tokenError',
          })}
        </span>
      </div>
    </Tooltip>
  );
};
