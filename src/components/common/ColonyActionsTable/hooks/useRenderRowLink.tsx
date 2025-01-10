import clsx from 'clsx';
import React from 'react';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { TX_SEARCH_PARAM } from '~routes/index.ts';
import { tw } from '~utils/css/index.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import {
  EXPANDER_COLUMN_ID,
  MEATBALL_MENU_COLUMN_ID,
} from '~v5/common/Table/consts.ts';
import { type RenderCellWrapper } from '~v5/common/Table/types.ts';
import Link from '~v5/shared/Link/index.ts';

const useRenderRowLink = (
  loading: boolean,
  isRecentActivityVariant: boolean = false,
): RenderCellWrapper<ActivityFeedColonyAction> => {
  const cellClassName = tw(
    'flex h-full flex-col justify-center py-4 text-md text-gray-500 sm:py-1',
  );

  return (_, content, { cell, row }) => {
    const isMeatballMenuColumn =
      cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID;
    const isExpanderColumn = cell.column.columnDef.id === EXPANDER_COLUMN_ID;

    if (isMeatballMenuColumn || isExpanderColumn || loading) {
      return (
        <div
          className={clsx(cellClassName, {
            'items-end': isMeatballMenuColumn,
          })}
        >
          {content}
        </div>
      );
    }

    return (
      <Link
        className={clsx(cellClassName, {
          'items-end': isRecentActivityVariant,
          'items-start': !isRecentActivityVariant,
        })}
        to={setQueryParamOnUrl({
          params: { [TX_SEARCH_PARAM]: row.original.transactionHash },
        })}
      >
        {content}
      </Link>
    );
  };
};

export default useRenderRowLink;
