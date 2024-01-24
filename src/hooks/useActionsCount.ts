import { startOfDay, subDays } from 'date-fns';

import { useColonyContext } from '~context/ColonyContext';
import { useGetTotalColonyActionsQuery } from '~gql';
import { getDomainDatabaseId } from '~utils/databaseId';

import { getBaseSearchActionsFilterVariable } from './useActivityFeed/helpers';

const getThirtyDaysAgoIso = () => {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const midnightThirtyDaysAgo = startOfDay(thirtyDaysAgo);
  return midnightThirtyDaysAgo.toISOString();
};

interface UseActionsCountParams {
  domainId?: number;
  onlyRecent?: boolean;
}

/**
 * Hook returning the total number of actions matching the given params
 */
const useActionsCount = (params?: UseActionsCountParams) => {
  const { domainId, onlyRecent } = params ?? {};
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};

  const { data, loading } = useGetTotalColonyActionsQuery({
    variables: {
      filter: {
        ...getBaseSearchActionsFilterVariable(colonyAddress),
        or: domainId
          ? [
              {
                fromDomainId: {
                  eq: getDomainDatabaseId(colonyAddress, domainId),
                },
              },
              {
                motionDomainId: { eq: domainId },
              },
            ]
          : undefined,
        createdAt: onlyRecent
          ? {
              gte: getThirtyDaysAgoIso(),
            }
          : undefined,
      },
    },
    skip: !colony,
  });

  const actionsCount = data?.searchColonyActions?.total ?? 0;

  return {
    actionsCount,
    loading,
  };
};

export default useActionsCount;
