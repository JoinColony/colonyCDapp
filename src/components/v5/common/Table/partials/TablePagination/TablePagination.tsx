import clsx from 'clsx';
import React, { type FC, type PropsWithChildren } from 'react';

import { useMobile } from '~hooks/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { type TablePaginationProps } from './types.ts';

const TablePagination: FC<PropsWithChildren<TablePaginationProps>> = ({
  onNextClick,
  onPrevClick,
  pageNumberLabel,
  canGoToNextPage,
  canGoToPreviousPage,
  disabled,
  hasHorizontalPadding = true,
  children,
}) => {
  const isMobile = useMobile();
  const canGoNextOrAdditionalContentOnMobile =
    canGoToNextPage || (children && isMobile);
  const canGoPreviousOrAdditionalContentOnDesktop =
    canGoToPreviousPage || (children && !isMobile);
  return (
    <div
      className={clsx(
        'grid grid-cols-[1fr_auto_1fr] items-center gap-2 pb-[1.4375rem] pt-2',
        {
          'px-[1.125rem]': hasHorizontalPadding,
          'sm:grid-cols-[1fr_auto_auto]': canGoNextOrAdditionalContentOnMobile,
          'sm:grid-cols-[1fr_auto]': !canGoNextOrAdditionalContentOnMobile,
        },
      )}
    >
      {canGoPreviousOrAdditionalContentOnDesktop && (
        <div className="col-start-1 row-start-1 flex items-center justify-start gap-3 sm:col-start-2">
          {!isMobile && children}
          {canGoToPreviousPage && (
            <Button
              onClick={onPrevClick}
              size="small"
              mode="primaryOutline"
              disabled={disabled}
            >
              {formatText({ id: 'table.previous' })}
            </Button>
          )}
        </div>
      )}
      {pageNumberLabel && (
        <p className="col-start-2 row-start-1 w-full text-center text-gray-700 text-3 sm:col-start-1 sm:w-auto sm:text-left">
          {pageNumberLabel}
        </p>
      )}
      {canGoNextOrAdditionalContentOnMobile && (
        <div className="col-start-3 row-start-1 flex items-center justify-end gap-3">
          {isMobile && children}
          {canGoToNextPage && (
            <Button
              onClick={onNextClick}
              size="small"
              mode="primaryOutline"
              disabled={disabled}
            >
              {formatText({ id: 'table.next' })}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TablePagination;
