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
