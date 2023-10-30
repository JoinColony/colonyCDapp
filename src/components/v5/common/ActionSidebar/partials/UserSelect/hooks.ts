import { useMemo } from 'react';
import { useColonyContext } from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { useGetVerifiedMembersQuery } from '~gql';
import { SearchSelectOption } from '~v5/shared/SearchSelect/types';
import { unionOfArraysToArrayOfUnions } from '~utils/arrays';

export const useUserSelect = (inputValue: string): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { colonyAddress = '', metadata } = colony ?? {};
  const { members, loading } = useGetColonyMembers(colonyAddress);
  const isWhitelistActivated = metadata?.isWhitelistActivated;
  const { data, loading: verifiedMembersLoading } = useGetVerifiedMembersQuery({
    variables: { colonyAddress },
    skip: !colonyAddress || !isWhitelistActivated,
  });
  const options = useMemo(
    () =>
      unionOfArraysToArrayOfUnions(
        isWhitelistActivated
          ? data?.getContributorsByColony?.items.map(
              (contributor) => contributor?.user,
            ) || []
          : members,
      ).reduce<SearchSelectOption[]>((result, user) => {
        if (!user) {
          return result;
        }

        const { walletAddress, profile } = user;

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
    [data?.getContributorsByColony?.items, isWhitelistActivated, members],
  );

  const isUserVerified = options.some(
    ({ walletAddress }) => walletAddress === inputValue,
  );

  const isRecipientNotVerified: boolean = !!inputValue && !isUserVerified;

  return {
    isLoading: loading || verifiedMembersLoading,
    options,
    key: 'users',
    title: { id: 'actions.recipent' },
    isAccordion: false,
    isUserVerified,
    isRecipientNotVerified,
  };
};
