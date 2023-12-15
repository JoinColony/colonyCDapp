import sub from 'date-fns/sub';

import { ADDRESS_ZERO, DEFAULT_TOKEN_DECIMALS } from '~constants';
import { ColonyActionType } from '~gql';
import {
  ActivityFeedColonyAction,
  ActivityFeedFilters,
} from '~hooks/useActivityFeed/types';

import { ColonyActionsTableFilters } from './types';

export const makeLoadingRows = (pageSize: number): ActivityFeedColonyAction[] =>
  Array.from(
    {
      length: pageSize,
    },
    (_, index) => ({
      blockNumber: index,
      colony: {
        colonyAddress: ADDRESS_ZERO,
        nativeToken: {
          tokenAddress: ADDRESS_ZERO,
          nativeTokenDecimals: DEFAULT_TOKEN_DECIMALS,
          nativeTokenSymbol: 'TKN',
        },
      },
      colonyAddress: ADDRESS_ZERO,
      createdAt: new Date().toISOString(),
      initiatorAddress: ADDRESS_ZERO,
      initiatorUser: {
        walletAddress: ADDRESS_ZERO,
      },
      showInActionsList: true,
      transactionHash: ADDRESS_ZERO + index,
      type: ColonyActionType.Payment,
    }),
  );

export const getDateFilter = (
  dateFilter: Partial<ColonyActionsTableFilters['date']> | undefined,
): Pick<ActivityFeedFilters, 'dateFrom' | 'dateTo'> | undefined => {
  if (!dateFilter) {
    return undefined;
  }

  const now = new Date();
  const baseFilter = {
    dateTo: now,
  };

  switch (true) {
    case dateFilter.pastHour: {
      return {
        dateFrom: sub(now, { hours: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastDay: {
      return {
        dateFrom: sub(now, { days: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastWeek: {
      return {
        dateFrom: sub(now, { weeks: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastMonth: {
      return {
        dateFrom: sub(now, { months: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastYear: {
      return {
        dateFrom: sub(now, { years: 1 }),
        ...baseFilter,
      };
    }
    default: {
      return undefined;
    }
  }
};
