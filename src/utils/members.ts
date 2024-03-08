import { apolloClient } from '~apollo';
import {
  GetColonyContributorDocument,
  GetColonyContributorsDocument,
  GetNotVerifiedMembersDocument,
  GetUsersDocument,
  GetVerifiedMembersDocument,
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
  // useUsersByAddresses is called by the `SelectedMembers` component
  await apolloClient.refetchQueries({
    include: [
      GetColonyContributorsDocument,
      GetUsersDocument,
      GetNotVerifiedMembersDocument,
      GetVerifiedMembersDocument,
    ],
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
      const isUserAffected = userAddresses.some(
        (address) => address === contributorAddress,
      );

      // refetch only if user's verified status was changed
      return isUserAffected;
    },
  });
};
