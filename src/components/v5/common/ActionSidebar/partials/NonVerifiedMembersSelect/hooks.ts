import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { splitAddress } from '~utils/strings/index.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useNonVerifiedMembersSelect = () => {
  const { totalMembers } = useMemberContext();

  const options = totalMembers.reduce<SearchSelectOption[]>(
    (result, member) => {
      if (member.isVerified) {
        return result;
      }

      const { walletAddress, profile } = member.user || {};

      const splittedWalletAddress =
        walletAddress && splitAddress(walletAddress);
      const maskedWalletAddress =
        splittedWalletAddress &&
        `${splittedWalletAddress.header}${splittedWalletAddress.start}...${splittedWalletAddress.end}`;

      const splittedContributorAddress = splitAddress(
        member.contributorAddress,
      );
      const maskedContributorAddress = `${splittedContributorAddress.header}${splittedContributorAddress.start}...${splittedContributorAddress.end}`;

      return [
        ...result,
        {
          value: walletAddress || '',
          isVerified: false,
          label:
            profile?.displayName ||
            (walletAddress && maskedWalletAddress) ||
            maskedContributorAddress,
          avatar: profile?.thumbnail || profile?.avatar || undefined,
          id: result.length,
          showAvatar: true,
          walletAddress,
          profile,
        },
      ];
    },
    [],
  );

  return {
    usersOptions: {
      options: options || [],
      key: 'users',
      title: {
        id: 'actions.notVerifiedMembers',
      },
    },
  };
};
