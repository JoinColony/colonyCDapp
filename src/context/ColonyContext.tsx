import React, { createContext, useMemo, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';
import { ObservableQuery } from '@apollo/client';

import { useGetFullColonyByNameQuery } from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useCanInteractWithColony } from '~hooks';

interface ColonyContextValue {
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
  refetchColony: (() => null) | ObservableQuery['refetch'];
}

const ColonyContext = createContext<ColonyContextValue>({
  loading: false,
  canInteractWithColony: false,
  refetchColony: () => null,
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

  const {
    data,
    loading,
    error,
    refetch: refetchColony,
  } = useGetFullColonyByNameQuery({
    skip: !colonyName,
    variables: {
      name: colonyName ?? '',
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  const canInteractWithColony = useCanInteractWithColony(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({
      colony,
      loading,
      canInteractWithColony,
      refetchColony,
    }),
    [colony, loading, canInteractWithColony, refetchColony],
  );

  if (!colonyName) {
    return null;
  }

  if (loading) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!colony || error) {
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
