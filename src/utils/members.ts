import { apolloClient } from '~apollo';
import {
  GetColonyContributorDocument,
  type GetColonyContributorQuery,
  GetColonyContributorsDocument,
  type GetColonyContributorsQuery,
} from '~gql';
import { type ColonyContributor } from '~types/graphql.ts';

export const searchMembers = (
  members: ColonyContributor[],
  searchValue?: string,
) => {
  if (!searchValue) {
    return members;
  }

  return members.filter(({ contributorAddress: address, user }) => {
    return (
      user?.profile?.displayName
        ?.toLowerCase()
        .startsWith(searchValue.toLowerCase()) ||
      address.toLowerCase().startsWith(searchValue.toLowerCase())
    );
  });
};

export const getColonyContributorId = (
  colonyAddress: string,
  walletAddress: string,
) => `${colonyAddress}_${walletAddress}`;

export const getColonyContributorAddressFromId = (
  colonyContributorId: string,
) => colonyContributorId.split('_')[1];

export const invalidateMemberQueries = (
  userAddresses: string[],
  colonyAddress: string,
  isVerified: boolean,
) => {
  apolloClient.cache.updateQuery(
    {
      query: GetColonyContributorsDocument,
      variables: {
        colonyAddress,
      },
    },
    (
      data: GetColonyContributorsQuery | null,
    ): GetColonyContributorsQuery | null => {
      if (!data?.getContributorsByColony) {
        return null;
      }

      const modifiedContributors = data.getContributorsByColony.items.map(
        (contributor) => {
          if (
            !contributor ||
            !userAddresses.includes(contributor.contributorAddress)
          ) {
            return contributor;
          }

          return {
            ...contributor,
            isVerified,
          };
        },
      );

      return {
        ...data,
        getContributorsByColony: {
          ...data.getContributorsByColony,
          items: modifiedContributors,
        },
      };
    },
  );

  for (const userAddress of userAddresses) {
    apolloClient.cache.updateQuery(
      {
        query: GetColonyContributorDocument,
        variables: {
          colonyAddress,
          id: getColonyContributorId(colonyAddress, userAddress),
        },
      },
      (
        data: GetColonyContributorQuery | null,
      ): GetColonyContributorQuery | null => {
        if (!data?.getColonyContributor) {
          return null;
        }

        return {
          ...data,
          getColonyContributor: {
            ...data.getColonyContributor,
            isVerified,
          },
        };
      },
    );
  }
};
