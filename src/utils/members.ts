import { Member } from '~types';

export const searchMembers = (members: Member[], searchValue?: string) =>
  members.filter(({ user }) => {
    return (
      user?.name.toLowerCase().startsWith(searchValue?.toLowerCase() ?? '') ||
      user?.walletAddress
        .toLowerCase()
        .startsWith(searchValue?.toLowerCase() ?? '')
    );
  });
