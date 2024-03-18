import { Id } from '@colony/colony-js';
import { useMemo } from 'react';

import { useMemberContext } from '~context/MemberContext/MemberContext.ts';
import { type SearchSelectOption } from '~v5/shared/SearchSelect/types.ts';

export const useUserSelect = ({
  domainId = Id.RootDomain,
  filterOptionsFn,
}: {
  domainId?: number;
  filterOptionsFn?: (option: SearchSelectOption) => boolean;
}) => {
  const { totalMembers, loading } = useMemberContext();

  const options = useMemo(
    () =>
      totalMembers.reduce<SearchSelectOption[]>((result, member) => {
        if (!member) {
          return result;
        }

        const { reputation, user } = member;
        const reputationItems = reputation?.items ?? [];
        const userReputation = reputationItems?.find(
          (item) =>
            item?.domain.nativeId === domainId ||
            item?.domain.nativeId === Id.RootDomain,
        )?.reputationRaw;

        const { walletAddress, profile } = user || {};

        return [
          ...result,
          {
            value: walletAddress || member.contributorAddress,
            label:
              profile?.displayName ||
              walletAddress ||
              member.contributorAddress,
            avatar: profile?.thumbnail || profile?.avatar || '',
            thumbnail: profile?.thumbnail || '',
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
