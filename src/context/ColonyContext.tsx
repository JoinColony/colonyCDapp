import React, {
  createContext,
  useMemo,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import {
  useGetFullColonyByNameQuery,
  GetFullColonyByNameQuery,
  GetFullColonyByNameQueryVariables,
  GetFullColonyByNameDocument,
} from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useCanInteractWithColony } from '~hooks';

import { getContext, ContextModule } from './index';

interface ColonyContextValue {
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
  updateColony?: () => void;
}

const ColonyContext = createContext<ColonyContextValue>({
  loading: false,
  canInteractWithColony: false,
});

const displayName = 'ColonyContextProvider';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading Colony',
  },
});

export const ColonyContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { colonyName } = useParams<{ colonyName: string }>();
  const [latestColony, setLatestColony] = useState<Colony>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [colonyError, setColonyError] = useState(false);

  const { data, loading, error } = useGetFullColonyByNameQuery({
    skip: !colonyName,
    variables: {
      name: colonyName ?? '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const updateColony = useCallback(() => {
    if (colonyName) {
      try {
        setUpdateLoading(true);
        const apolloClient = getContext(ContextModule.ApolloClient);
        const query = apolloClient.query<
          GetFullColonyByNameQuery,
          GetFullColonyByNameQueryVariables
        >({
          query: GetFullColonyByNameDocument,
          variables: { name: colonyName ?? '' },
          fetchPolicy: 'network-only',
        });
        query.then(({ data: result }) => {
          const currentColony =
            result?.getColonyByName?.items?.[0] ?? undefined;
          if (currentColony) {
            setLatestColony(currentColony);
          } else {
            setLatestColony(undefined);
          }
        });
      } catch (e) {
        console.error(e);
        setColonyError(e);
      } finally {
        setUpdateLoading(false);
      }
    }
  }, [colonyName]);

  const colony = latestColony ?? data?.getColonyByName?.items?.[0] ?? undefined;

  const canInteractWithColony = useCanInteractWithColony(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      loading,
      canInteractWithColony,
      updateLoading,
      updateColony,
    }),
    [colony, loading, canInteractWithColony, updateLoading, updateColony],
  );

  if (!colonyName) {
    return null;
  }

  if (loading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!colony || colonyError || error) {
    return <NotFoundRoute />;
  }

  return (
    <ColonyContext.Provider value={colonyContext}>
      {children}
    </ColonyContext.Provider>
  );
};

ColonyContext.displayName = displayName;

export { ColonyContext };
