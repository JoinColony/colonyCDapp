import { useMemo } from 'react';

import {
  type GetStreamingPaymentsByColonyQueryVariables,
  useGetStreamingPaymentsByColonyQuery,
} from '~gql';
import { notNull } from '~utils/arrays/index.ts';

export const useColonyStreamingPayments = (
  variables: GetStreamingPaymentsByColonyQueryVariables,
) => {
  const { data, fetchMore, loading } = useGetStreamingPaymentsByColonyQuery({
    variables,
    onCompleted: (receivedData) => {
      if (receivedData?.getStreamingPaymentsByColony?.nextToken) {
        fetchMore({
          variables: {
            nextToken: receivedData.getStreamingPaymentsByColony.nextToken,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            return {
              ...prev,
              getStreamingPaymentsByColony: {
                ...prev.getStreamingPaymentsByColony,
                items: [
                  ...(prev?.getStreamingPaymentsByColony?.items || []),
                  ...(fetchMoreResult?.getStreamingPaymentsByColony?.items ||
                    []),
                ],
                nextToken:
                  fetchMoreResult?.getStreamingPaymentsByColony?.nextToken,
              },
            };
          },
        });
      }
    },
  });

  const streamingPayments = useMemo(
    () => data?.getStreamingPaymentsByColony?.items?.filter(notNull) || [],
    [data?.getStreamingPaymentsByColony?.items],
  );

  return { streamingPayments, loading, fetchMore };
};
