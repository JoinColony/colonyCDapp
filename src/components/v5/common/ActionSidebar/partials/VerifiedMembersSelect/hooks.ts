import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { splitAddress } from '~utils/strings.ts';
import {
  type SearchSelectOption,
  type UserOption,
} from '~v5/shared/SearchSelect/types.ts';

export const useVerifiedMembersSelect = () => {
  const { verifiedMembers } = useMemberContext();

  const options = verifiedMembers.reduce<SearchSelectOption<UserOption>[]>(
    (result, member) => {
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
          isVerified: true,
          label:
            profile?.displayName ||
            (walletAddress && maskedWalletAddress) ||
            maskedContributorAddress,
          avatar: profile?.thumbnail || profile?.avatar || undefined,
          id: result.length,
          profile,
          showAvatar: true,
          walletAddress,
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
        id: 'actions.verifiedMembers',
      },
    },
  };
};
