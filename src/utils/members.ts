import { ContributorWithReputation } from '~types';

export const searchMembers = (
  members: ContributorWithReputation[],
  searchValue?: string,
) => {
  if (!searchValue) {
    return members;
  }

  return members.filter(({ address, user }) => {
    return (
      user?.name.toLowerCase().startsWith(searchValue?.toLowerCase() ?? '') ||
      address.toLowerCase().startsWith(searchValue?.toLowerCase() ?? '')
    );
  });
};
