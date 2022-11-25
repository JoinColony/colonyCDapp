import React, { createContext, useMemo, ReactNode } from 'react';
import { ApolloError } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { useGetFullColonyByNameQuery } from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useCanInteractWithColony } from '~hooks';

interface ColonyContextValue {
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
  error?: ApolloError;
}

const ColonyContext = createContext<ColonyContextValue>({
  loading: false,
  canInteractWithColony: false,
  error: undefined,
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

  const { data, loading, error } = useGetFullColonyByNameQuery({
    skip: !colonyName,
    variables: {
      name: colonyName ?? '',
    },
    fetchPolicy: 'cache-and-network',
  });

  const colony = data?.getColonyByName?.items?.[0] ?? undefined;

  const canInteractWithColony = useCanInteractWithColony(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({ colony, loading, canInteractWithColony, error }),
    [colony, loading, canInteractWithColony, error],
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
