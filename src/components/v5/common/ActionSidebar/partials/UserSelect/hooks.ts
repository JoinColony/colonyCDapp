import { useMemo } from 'react';

import { useColonyContext } from '~hooks';
import { SearchSelectOption } from '~v5/shared/SearchSelect/types';
import { unionOfArraysToArrayOfUnions } from '~utils/arrays';
import { getVerifiedUsers, isUserVerified } from '~utils/verifiedUsers';
import { Address } from '~types';
import { useMemberContext } from '~context/MemberContext';

import { UserSelectHookProps } from './types';

export const useUserSelect = (): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { metadata } = colony ?? {};
  const { allMembers, verifiedMembers, loading } = useMemberContext();

  const members = verifiedMembers?.length > 0 ? verifiedMembers : allMembers;

  const isWhitelistActivated = metadata?.isWhitelistActivated;
  const options = useMemo(
    () =>
      unionOfArraysToArrayOfUnions(
        isWhitelistActivated
          ? getVerifiedUsers(
              colony?.metadata?.whitelistedAddresses || [],
              members,
            )
          : members,
      ).reduce<SearchSelectOption[]>((result, member) => {
        if (!member) {
          return result;
        }

        const { walletAddress, profile } = member?.user || {};

        return [
          ...result,
          {
            value: walletAddress,
            label: profile?.displayName || walletAddress,
            avatar: profile?.thumbnail || profile?.avatar || '',
            walletAddress,
            id: result.length,
            showAvatar: true,
          },
        ];
      }, []),
    [colony?.metadata?.whitelistedAddresses, isWhitelistActivated, members],
  );

  return {
    isLoading: loading,
    options,
    key: 'users',
    title: { id: 'actions.recipent' },
  };
};

export const useIsUserVerified = (
  userAddress: Address | undefined,
): boolean => {
  const { colony } = useColonyContext();

  return userAddress
    ? isUserVerified(userAddress, colony?.metadata?.whitelistedAddresses || [])
    : false;
};
