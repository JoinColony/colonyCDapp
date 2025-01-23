import { type ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import React from 'react';

import { useMobile } from '~hooks';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { tw } from '~utils/css/index.ts';
import {
  EXPANDER_COLUMN_ID,
  MEATBALL_MENU_COLUMN_ID,
} from '~v5/common/Table/consts.ts';
import { type RenderCellWrapper } from '~v5/common/Table/types.ts';

import { MOTION_STATE_COLUMN_ID } from '../consts.ts';
import { ColonyActionLinkWrapper } from '../partials/ColonyActionLinkWrapper.tsx';

interface CellConfig {
  isMeatballMenu: boolean;
  isExpander: boolean;
  isMotionState: boolean;
}

interface StyleConfig {
  isRecentActivityVariant: boolean;
}

const baseCellClassName = tw(
  'flex h-full flex-col justify-center py-4 text-md text-gray-500 sm:py-1',
);

const getCellClassName = (
  cellConfig: CellConfig,
  styleConfig: StyleConfig,
  isLinkDisabled,
) => {
  const { isMeatballMenu, isMotionState } = cellConfig;
  const { isRecentActivityVariant } = styleConfig;

  if (!isLinkDisabled) {
    return {
      'items-end': isRecentActivityVariant,
      'items-start': !isRecentActivityVariant,
    };
  }

  return {
    'items-end': isMeatballMenu || (isMotionState && isRecentActivityVariant),
    'items-start': isMotionState && !isRecentActivityVariant,
  };
};

const shouldDisableLink = (
  { isMeatballMenu, isExpander, isMotionState }: CellConfig,
  isMobile: boolean,
  loading: boolean,
): boolean => {
  return isMeatballMenu || isExpander || (isMobile && isMotionState) || loading;
};

const isMotionStateColumn = (
  column: ColumnDef<ActivityFeedColonyAction, unknown>,
): boolean => {
  return (
    'accessorKey' in column && column.accessorKey === MOTION_STATE_COLUMN_ID
  );
};

const useRenderRowLink = (
  loading: boolean,
  isRecentActivityVariant: boolean = false,
): RenderCellWrapper<ActivityFeedColonyAction> => {
  const isMobile = useMobile();
  const styleConfig = { isRecentActivityVariant };

  return (_, content, { cell, row }) => {
    const cellConfig = {
      isMeatballMenu: cell.column.columnDef.id === MEATBALL_MENU_COLUMN_ID,
      isExpander: cell.column.columnDef.id === EXPANDER_COLUMN_ID,
      isMotionState: isMotionStateColumn(cell.column.columnDef),
    };

    const isLinkDisabled = shouldDisableLink(cellConfig, isMobile, loading);
    const cellClassName = getCellClassName(
      cellConfig,
      styleConfig,
      isLinkDisabled,
    );

    return (
      <ColonyActionLinkWrapper
        txHash={!isLinkDisabled ? row.original.transactionHash : undefined}
        className={clsx(baseCellClassName, cellClassName)}
      >
        {content}
      </ColonyActionLinkWrapper>
    );
  };
};

export default useRenderRowLink;
