import { useEffect, useState } from 'react';
import { Id } from '@colony/colony-js';

import { ContextModule, getContext } from '~context';
import { getExtensionInstallations } from './utils';
import {
  GetContributorsWithReputationDocument,
  GetContributorsWithReputationQuery,
  GetContributorsWithReputationQueryVariables,
} from '~gql';
import { getDomainDatabaseId } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { ContributorTypeFilter } from '~v5/common/TableFiltering/types';
import { unionBy } from '~utils/lodash';
import { ContributorWithReputation } from '~types';

const getContributorsWithReputation = async (
  colonyAddress: string,
  nativeDomainId: number,
  limit: number,
) => {
  const apollo = getContext(ContextModule.ApolloClient);
  const installedExtensionAddresses = await getExtensionInstallations(
    colonyAddress,
  );
  const { data } =
    (await apollo.query<
      GetContributorsWithReputationQuery,
      GetContributorsWithReputationQueryVariables
    >({
      query: GetContributorsWithReputationDocument,
      variables: {
        colonyAddress,
        domainId: getDomainDatabaseId(colonyAddress, nativeDomainId),
        limit,
      },
    })) ?? {};

  return {
    contributorsWithReputation:
      data.getContributorsByDomainAndColony?.items
        .filter(notNull)
        .filter(({ address }) => !installedExtensionAddresses.has(address)) ??
      [],
    nextToken: data.getContributorsByDomainAndColony?.nextToken,
  };
};

const useContributorsWithReputation = (
  colonyAddress: string,
  nativeDomainIds: number[],
  contributorTypes: ContributorTypeFilter[],
  limit: number,
) => {
  const [contributors, setContributors] = useState<ContributorWithReputation[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [canFetchMore, setCanFetchMore] = useState<boolean>(false);

  useEffect(() => {
    const contributorTypeSet = new Set(contributorTypes);
    const fetchContributorsWithReputation = async () => {
      setLoading(true);
      let contributorsWithRep: ContributorWithReputation[][] = [[]];
      let canFetchMoreContributors = false;

      if (contributorTypeSet.size) {
        if (nativeDomainIds.includes(Id.RootDomain)) {
          // Can only have a contributor type in the root domain
          const { contributorsWithReputation, nextToken } =
            await getContributorsWithReputation(
              colonyAddress,
              Id.RootDomain,
              limit,
            );

          if (nextToken) {
            canFetchMoreContributors = true;
          }

          contributorsWithRep = [
            contributorsWithReputation
              .filter(({ type }) => {
                if (!type) {
                  // shouldn't happen since "type" is always set in the root domain.
                  return false;
                }
                return contributorTypeSet.has(
                  type.toLowerCase() as ContributorTypeFilter,
                );
              })
              .map(
                ({
                  address,
                  user,
                  type,
                  colonyReputationPercentage,
                  domainReputationPercentage,
                }) => ({
                  address,
                  user,
                  type: (type && type.toLowerCase()) as
                    | ContributorTypeFilter
                    | null
                    | undefined,
                  colonyReputationPercentage,
                  domainReputationPercentage,
                }),
              ) ?? [],
          ];
        }
      } else {
        contributorsWithRep = await Promise.all(
          nativeDomainIds.map(async (nativeDomainId) => {
            const { contributorsWithReputation, nextToken } =
              await getContributorsWithReputation(
                colonyAddress,
                nativeDomainId,
                limit,
              );

            if (nextToken) {
              canFetchMoreContributors = true;
            }

            return (
              contributorsWithReputation.map(
                ({
                  address,
                  user,
                  type,
                  colonyReputationPercentage,
                  domainReputationPercentage,
                }) => ({
                  address,
                  user,
                  type: (type && type.toLowerCase()) as
                    | ContributorTypeFilter
                    | null
                    | undefined,
                  colonyReputationPercentage,
                  domainReputationPercentage,
                }),
              ) ?? []
            );
          }),
        );
      }

      setCanFetchMore(canFetchMoreContributors);

      setContributors(
        // @ts-ignore
        unionBy(...contributorsWithRep, 'address'),
      );

      setLoading(false);
    };

    fetchContributorsWithReputation();
  }, [colonyAddress, nativeDomainIds, contributorTypes, limit]);

  return { contributorsWithReputation: contributors, loading, canFetchMore };
};

export default useContributorsWithReputation;
