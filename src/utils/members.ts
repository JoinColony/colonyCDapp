import { apolloClient } from '~apollo';
import {
  GetColonyContributorDocument,
  type GetColonyContributorQuery,
  type Profile,
  SearchColonyContributorsDocument,
  type SearchColonyContributorsQuery,
} from '~gql';
import { type ColonyContributor } from '~types/graphql.ts';
import { merge } from '~utils/lodash.ts';

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

// @TODO this should use apolloClient's writeFragment
const updateContributorQueries = (
  updatedContributors: UpdatedContributorData[],
  colonyAddress: string,
) => {
  apolloClient.cache.updateQuery(
    {
      query: SearchColonyContributorsDocument,
      variables: {
        colonyAddress,
      },
    },
    (
      data: SearchColonyContributorsQuery | null,
    ): SearchColonyContributorsQuery | null => {
      if (!data?.searchColonyContributors) {
        return null;
      }

      const modifiedContributors = data.searchColonyContributors.items.map(
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

          return merge({ ...contributor }, contributorData.newData);
        },
      );

      return {
        ...data,
        searchColonyContributors: {
          ...data.searchColonyContributors,
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
          getColonyContributor: merge(
            { ...data.getColonyContributor },
            newData,
          ),
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

export const updateMemberProfile = (
  userAddress: string,
  colonyAddress: string,
  newProfile: Partial<Profile>,
) => {
  const newContributorData = {
    user: {
      walletAddress: userAddress,
      profile: newProfile,
    },
  };

  updateContributorQueries(
    [{ userAddress, newData: newContributorData }],
    colonyAddress,
  );
};

export const clearContributorsAndRolesCache = () => {
  apolloClient.cache.evict({ fieldName: 'searchColonyContributors' });
  apolloClient.cache.evict({ fieldName: 'getRoleByDomainAndColony' });
};
