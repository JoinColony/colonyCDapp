import { type Icon } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type Message } from '~types';
import { formatText } from '~utils/intl.ts';

import { DEFAULT_TOOLTIP_POSITION, ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.ActionData';

interface Props {
  rowLabel: Message;
  rowContent: React.ReactNode;
  tooltipContent: Message;
  RowIcon: Icon;
}

const ActionData = ({
  rowLabel,
  tooltipContent,
  rowContent,
  RowIcon,
}: Props) => {
  return (
    <>
      <div>
        <Tooltip
          placement={DEFAULT_TOOLTIP_POSITION}
          tooltipContent={formatText(tooltipContent)}
        >
          <div className="flex items-center gap-2">
            <RowIcon size={ICON_SIZE} />
            <span>{formatText(rowLabel)}</span>
          </div>
        </Tooltip>
      </div>
      <span>{rowContent}</span>
    </>
  );
};

ActionData.displayName = displayName;
export default ActionData;
