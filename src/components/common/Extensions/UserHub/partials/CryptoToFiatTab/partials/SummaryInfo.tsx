import { Info } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';

const displayName = 'common.Extensions.UserHub.partials.SummaryInfo';

interface SummaryInfoProps {
  tooltipContent: string;
  isDisabled?: boolean;
}

const SummaryInfo: FC<SummaryInfoProps> = ({ isDisabled, tooltipContent }) => {
  return (
    <Tooltip
      tooltipContent={!isDisabled ? tooltipContent : null}
      placement="top-end"
      offset={[8, 12]}
    >
      <Info
        size={12}
        className={clsx('', {
          'text-gray-300': isDisabled,
          'text-gray-400': !isDisabled,
        })}
      />
    </Tooltip>
  );
};

SummaryInfo.displayName = displayName;

export default SummaryInfo;
