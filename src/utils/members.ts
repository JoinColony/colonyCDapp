import { apolloClient } from '~apollo';
import {
  GetColonyContributorDocument,
  GetColonyContributorsDocument,
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

export const invalidateMemberQueries = async (
  userAddresses: string[],
  colonyAddress: string,
): Promise<void> => {
  // we deliberately have separate calls due to https://www.apollographql.com/docs/react/data/refetching/#onqueryupdated
  // so we don't need to put if statements into the callback, and it just always executed for the GetColonyContributor query
  await apolloClient.refetchQueries({
    include: [GetColonyContributorsDocument],
  });
  await apolloClient.refetchQueries({
    include: [GetColonyContributorDocument],
    onQueryUpdated: (query) => {
      // useGetColonyContributorQuery variables
      if (
        !query.variables?.id ||
        !query.variables?.colonyAddress ||
        query.variables.colonyAddress !== colonyAddress
      ) {
        return false;
      }

      const colonyContributorId = query.variables.id;

      const contributorAddress =
        getColonyContributorAddressFromId(colonyContributorId);
      const isUserAffected = userAddresses.indexOf(contributorAddress) !== -1;

      // refetch only if user's verified status was changed
      return isUserAffected;
    },
  });
};
