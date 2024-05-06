import React, { type FC } from 'react';
import { generatePath } from 'react-router-dom';

import ActionBadge from '~common/ColonyActionsTable/partials/ActionBadge/ActionBadge.tsx';
import { APP_URL } from '~constants';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import {
  COLONY_ACTIVITY_ROUTE,
  COLONY_HOME_ROUTE,
  TX_SEARCH_PARAM,
} from '~routes';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';

import { type RequestBoxItemProps } from './types.ts';

const RequestBoxItem: FC<RequestBoxItemProps> = ({
  date,
  motionState,
  transactionHash,
}) => {
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();
  const { colony } = useColonyContext();

  return (
    <Tooltip
      isOpen={isCopied}
      isSuccess
      isFullWidthContent
      placement="top"
      tooltipContent={formatText({
        id: 'colony.tooltip.url.copied',
      })}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between"
        onClick={() =>
          handleClipboardCopy(
            `${APP_URL.origin}/${generatePath(COLONY_HOME_ROUTE, {
              colonyName: colony.name,
            })}${COLONY_ACTIVITY_ROUTE}?${TX_SEARCH_PARAM}=${transactionHash}`,
          )
        }
      >
        <span className="text-sm text-gray-600">{date}</span>
        <ActionBadge motionState={motionState} />
      </button>
    </Tooltip>
  );
};

export default RequestBoxItem;
