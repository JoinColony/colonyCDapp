import sub from 'date-fns/sub';

import {
  ADDRESS_ZERO,
  DEFAULT_NETWORK_INFO,
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
        name: '',
        nativeToken: {
          tokenAddress: ADDRESS_ZERO,
          nativeTokenDecimals: DEFAULT_TOKEN_DECIMALS,
          nativeTokenSymbol: DEFAULT_NETWORK_TOKEN.symbol,
          name: '',
          chainMetadata: {
            chainId: DEFAULT_NETWORK_INFO.chainId,
          },
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
  dateFromCurrentBlockTime: Date,
): Pick<ActivityFeedFilters, 'dateFrom' | 'dateTo'> | undefined => {
  if (!dateFilter) {
    return undefined;
  }

  const baseFilter = {
    dateTo: dateFromCurrentBlockTime,
  };

  switch (true) {
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
    case dateFilter.pastYear: {
      return {
        dateFrom: sub(dateFromCurrentBlockTime, { years: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastMonth: {
      return {
        dateFrom: sub(dateFromCurrentBlockTime, { months: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastWeek: {
      return {
        dateFrom: sub(dateFromCurrentBlockTime, { weeks: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastDay: {
      return {
        dateFrom: sub(dateFromCurrentBlockTime, { days: 1 }),
        ...baseFilter,
      };
    }
    case dateFilter.pastHour: {
      return {
        dateFrom: sub(dateFromCurrentBlockTime, { hours: 1 }),
        ...baseFilter,
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
