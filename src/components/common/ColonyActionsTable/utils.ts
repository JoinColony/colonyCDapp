import sub from 'date-fns/sub';

import {
  ADDRESS_ZERO,
  DEFAULT_NETWORK_TOKEN,
  DEFAULT_TOKEN_DECIMALS,
} from '~constants/index.ts';
import { ColonyActionType } from '~gql';
import {
  type ActivityFeedFilters,
  type ActivityFeedColonyAction,
} from '~hooks/useActivityFeed/types.ts';
import { getFormattedDateFrom } from '~utils/getFormattedDateFrom.ts';

import { type DateOptions } from './partials/ActionsTableFilters/types.ts';

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
          nativeTokenSymbol: DEFAULT_NETWORK_TOKEN.symbol,
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
      rootHash: '',
    }),
  );

export const getDateFilter = (
  dateFilter: DateOptions | undefined,
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
    case !!dateFilter.custom: {
      const filteredDates = dateFilter.custom?.filter(
        (date): date is string => !!date,
      );

      if (!filteredDates) {
        return undefined;
      }

      const [from, to] = filteredDates;

      return {
        dateFrom: new Date(from),
        dateTo: new Date(to),
      };
    }
    default: {
      return undefined;
    }
  }
};

export const getCustomDateLabel = (dateRange?: DateOptions['custom']) => {
  const [startDateString, endDateString] = dateRange || [];
  if (!startDateString || !endDateString) {
    return null;
  }

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  return `${getFormattedDateFrom(startDate)} - ${getFormattedDateFrom(endDate)}`;
};
