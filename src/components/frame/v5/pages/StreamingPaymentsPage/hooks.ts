import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import {
  ColonyActionType,
  ModelSortDirection,
  useGetColonyActionsQuery,
} from '~gql';
import { notNull } from '~utils/arrays/index.ts';

const QUERY_PAGE_SIZE = 20;

export const useGetAllStreamingPayments = () => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

  const { data, loading, fetchMore, refetch } = useGetColonyActionsQuery({
    variables: {
      colonyAddress,
      filter: {
        type: { eq: ColonyActionType.CreateStreamingPayment },
      },
      sortDirection: ModelSortDirection.Desc,
      limit: QUERY_PAGE_SIZE,
    },
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      if (newData?.getActionsByColony?.nextToken) {
        fetchMore({
          variables: { nextToken: newData?.getActionsByColony?.nextToken },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            // Here, combine the previous items with the newly fetched items
            return {
              ...prev,
              getActionsByColony: {
                ...prev.getActionsByColony,
                items: [
                  ...(prev.getActionsByColony?.items ?? []),
                  ...(fetchMoreResult.getActionsByColony?.items ?? []),
                ],
                nextToken: fetchMoreResult?.getActionsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const streamingPaymentsData = data?.getActionsByColony?.items.filter(notNull);

  return {
    streamingPaymentsData,
    loading,
    refetchAgreements: refetch,
  };
};
