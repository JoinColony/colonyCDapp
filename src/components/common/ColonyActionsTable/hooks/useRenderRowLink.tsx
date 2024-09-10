import clsx from 'clsx';
import React from 'react';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { TX_SEARCH_PARAM } from '~routes/index.ts';
import { tw } from '~utils/css/index.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { type RenderCellWrapper } from '~v5/common/Table/types.ts';
import Link from '~v5/shared/Link/index.ts';

const useRenderRowLink = (
  loading: boolean,
  isRecentActivityVariant: boolean = false,
): RenderCellWrapper<ActivityFeedColonyAction> => {
  const cellClassName = tw(
    'flex h-full flex-col justify-center py-1 text-md text-gray-500',
  );

  return (_, content, { cell, row }) =>
    cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID || loading ? (
      <div
        className={clsx(cellClassName, {
          'items-end': cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID,
        })}
      >
        {content}
      </div>
    ) : (
      <Link
        className={clsx(cellClassName, {
          'items-end': isRecentActivityVariant,
          'items-start': !isRecentActivityVariant,
        })}
        to={setQueryParamOnUrl(
          window.location.search,
          TX_SEARCH_PARAM,
          row.original.transactionHash,
        )}
      >
        {content}
      </Link>
    );
};

export default useRenderRowLink;
