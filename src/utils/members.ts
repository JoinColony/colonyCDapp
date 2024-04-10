import { apolloClient } from '~apollo';
import {
  GetColonyContributorDocument,
  type GetColonyContributorQuery,
  GetColonyContributorsDocument,
  type GetColonyContributorsQuery,
} from '~gql';
import { type ColonyContributor } from '~types/graphql.ts';

export type UpdatedContributorData = {
  userAddress: string;
  newData: Partial<ColonyContributor>;
};

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

const updateContributorQueries = (
  updatedContributors: UpdatedContributorData[],
  colonyAddress: string,
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
          if (!contributor) {
            return contributor;
          }

          const contributorData = updatedContributors.find(
            (contributorEntry) =>
              contributorEntry.userAddress === contributor.contributorAddress,
          );

          if (!contributorData) {
            return contributor;
          }

          return {
            ...contributor,
            ...contributorData.newData,
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

  updatedContributors.forEach(({ userAddress, newData }) => {
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
            ...newData,
          },
        };
      },
    );
  });
};

export const updateContributorVerifiedStatus = (
  userAddresses: string[],
  colonyAddress: string,
  isVerified: boolean,
) => {
  const updatedContributors: UpdatedContributorData[] = userAddresses.map(
    (userAddress) => ({
      userAddress,
      newData: { isVerified },
    }),
  );

  updateContributorQueries(updatedContributors, colonyAddress);
};

export const updateMemberData = (
  userAddress: string,
  colonyAddress: string,
  newData: Partial<ColonyContributor>,
) => {
  updateContributorQueries([{ userAddress, newData }], colonyAddress);
};
