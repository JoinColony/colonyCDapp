import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { splitAddress } from '~utils/strings/index.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useUserSelect = () => {
  const { totalMembers, loading } = useMemberContext();

  const options = useMemo(
    () =>
      totalMembers.reduce<SearchSelectOption[]>((result, member) => {
        if (!member) {
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
            value: walletAddress || member.contributorAddress,
            label:
              profile?.displayName ||
              (walletAddress && maskedWalletAddress) ||
              maskedContributorAddress,
            avatar: profile?.thumbnail || profile?.avatar || '',
            thumbnail: profile?.thumbnail || '',
            id: result.length,
            showAvatar: true,
            walletAddress,
            isVerified: member.isVerified,
          },
        ];
      }, []),
    [totalMembers],
  );

  return {
    usersOptions: {
      isLoading: loading,
      options,
      key: 'users',
      title: { id: 'actions.recipient' },
    },
  };
};
