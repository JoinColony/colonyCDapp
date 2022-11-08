import React, { createContext, useMemo, ReactNode } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { defineMessages } from 'react-intl';

import { getFullColonyByName } from '~gql';
import { Colony } from '~types';
import LoadingTemplate from '~frame/LoadingTemplate';
import NotFoundRoute from '~routes/NotFoundRoute';
import { useCanInteractWithColony } from '~hooks';

interface ColonyContextValue {
  colony?: Colony;
  loading: boolean;
  canInteractWithColony: boolean;
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

  const { data, loading, error } = useQuery(gql(getFullColonyByName), {
    skip: !colonyName,
    variables: {
      name: colonyName ?? '',
    },
    fetchPolicy: 'network-only',
  });

  const [colony] = data?.getColonyByName?.items || [];

  const canInteractWithColony = useCanInteractWithColony(colony);

  const colonyContext = useMemo<ColonyContextValue>(
    () => ({ colony, loading, canInteractWithColony }),
    [colony, loading, canInteractWithColony],
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
