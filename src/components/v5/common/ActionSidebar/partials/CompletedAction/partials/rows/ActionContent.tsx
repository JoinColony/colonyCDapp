import { type Icon } from '@phosphor-icons/react';
import React from 'react';

import Tooltip from '~shared/Extensions/Tooltip/index.ts';
import { type Message } from '~types';
import { formatText } from '~utils/intl.ts';
import {
  DEFAULT_TOOLTIP_POSITION,
  ICON_SIZE,
} from '~v5/common/ActionSidebar/partials/CompletedAction/consts.ts';

const displayName = 'v5.common.CompletedAction.ActionContent';

interface Props {
  rowLabel: Message;
  rowContent: React.ReactNode;
  RowIcon: Icon;
  tooltipContent?: Message;
}

const ActionContent = ({
  rowLabel,
  tooltipContent,
  rowContent,
  RowIcon,
}: Props) => {
  const content = (
    <div className="flex items-center gap-2">
      <RowIcon size={ICON_SIZE} />
      <span>{formatText(rowLabel)}</span>
    </div>
  );

  return (
    <>
      <div>
        {tooltipContent ? (
          <Tooltip
            placement={DEFAULT_TOOLTIP_POSITION}
            tooltipContent={formatText(tooltipContent)}
          >
            {content}
          </Tooltip>
        ) : (
          content
        )}
      </div>
      <div>{rowContent}</div>
    </>
  );
};

ActionContent.displayName = displayName;
export default ActionContent;
