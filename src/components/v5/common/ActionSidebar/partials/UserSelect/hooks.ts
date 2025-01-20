import { Id } from '@colony/colony-js';
import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { splitAddress } from '~utils/strings.ts';

import { type UserSearchSelectOption } from './types.ts';

export const useUserSelect = ({
  domainId = Id.RootDomain,
  filterOptionsFn,
}: {
  domainId?: number;
  filterOptionsFn?: (option: UserSearchSelectOption) => boolean;
}) => {
  const { totalMembers, loading } = useMemberContext();

  const options = useMemo(
    () =>
      totalMembers.reduce<UserSearchSelectOption[]>((result, member) => {
        if (!member) {
          return result;
        }

        const { reputation, user } = member;
        const reputationItems = reputation?.items ?? [];
        const userReputation = reputationItems?.find(
          (item) => item?.domain.nativeId === domainId,
        )?.reputationRaw;

        const { walletAddress, profile } = user || {};

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
            avatar: profile?.thumbnail || profile?.avatar || undefined,
            thumbnail: profile?.thumbnail || undefined,
            id: result.length,
            showAvatar: true,
            walletAddress,
            isVerified: member.isVerified,
            userReputation,
          },
        ];
      }, []),
    [domainId, totalMembers],
  );

  return {
    usersOptions: {
      isLoading: loading,
      options: filterOptionsFn ? options.filter(filterOptionsFn) : options,
      key: 'users',
      title: { id: 'actions.recipient' },
    },
  };
};
