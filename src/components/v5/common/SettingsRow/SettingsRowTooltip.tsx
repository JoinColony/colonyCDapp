import { Info } from '@phosphor-icons/react';
import React, { type FC, type PropsWithChildren } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';

const displayName = 'v5.common.SettingsRow.Tooltip';

interface SettingsRowTooltipProps extends PropsWithChildren {}

const SettingsRowTooltip: FC<SettingsRowTooltipProps> = ({ children }) => {
  return (
    <Tooltip tooltipContent={children}>
      <span className="flex text-gray-400">
        <Info size={18} />
      </span>
    </Tooltip>
  );
};

SettingsRowTooltip.displayName = displayName;
export default SettingsRowTooltip;
