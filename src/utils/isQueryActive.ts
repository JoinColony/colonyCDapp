import { apolloClient } from '~apollo';

export const isQueryActive = (queryName: string) => {
  const activeQueries = apolloClient.getObservableQueries();
  return Array.from(activeQueries.values()).some((query) => {
    return query.queryName?.includes(queryName);
  });
};
