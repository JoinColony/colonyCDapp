import clsx from 'clsx';
import React from 'react';

import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { TX_SEARCH_PARAM } from '~routes/index.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import { MEATBALL_MENU_COLUMN_ID } from '~v5/common/Table/consts.ts';
import { type RenderCellWrapper } from '~v5/common/Table/types.ts';
import Link from '~v5/shared/Link/index.ts';

const useRenderRowLink = (
  loading: boolean,
): RenderCellWrapper<ActivityFeedColonyAction> => {
  const cellWrapperClassName = '!pt-[.5625rem] !pb-2';

  return (className, content, { cell, row }) =>
    cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID || loading ? (
      <div className={clsx(className, cellWrapperClassName)}>{content}</div>
    ) : (
      <Link
        className={clsx(className, cellWrapperClassName)}
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
