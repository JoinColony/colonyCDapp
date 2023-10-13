import { useMemo } from 'react';
import { useColonyContext } from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { useGetVerifiedMembersQuery } from '~gql';
import { SearchSelectOption } from '~v5/shared/SearchSelect/types';

export const useUserSelect = (inputValue: string): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { colonyAddress = '', metadata } = colony ?? {};
  const { members, loading } = useGetColonyMembers(colonyAddress);
  const isWhitelistActivated = metadata?.isWhitelistActivated;
  const { data, loading: verifiedMembersLoading } = useGetVerifiedMembersQuery({
    variables: { colonyAddress },
    skip: !colonyAddress || !isWhitelistActivated,
  });

  const verifiedUsers: SearchSelectOption[] = useMemo(
    () =>
      (data?.getContributorsByColony?.items ?? []).map((item, index) => ({
        value: item?.user?.walletAddress || '',
        label: item?.user?.profile?.displayName || '',
        avatar:
          item?.user?.profile?.avatar || item?.user?.profile?.thumbnail || '',
        walletAddress: item?.user?.walletAddress,
        id: index,
        showAvatar: true,
      })),
    [data?.getContributorsByColony?.items],
  );

  const preparedUserOptions: SearchSelectOption[] = isWhitelistActivated
    ? verifiedUsers
    : members || [];

  const isUserVerified = preparedUserOptions.some(
    ({ walletAddress }) => walletAddress === inputValue,
  );

  const isRecipientNotVerified: boolean = !!inputValue && !isUserVerified;

  return {
    isLoading: loading || verifiedMembersLoading,
    options: preparedUserOptions,
    key: 'users',
    title: { id: 'actions.recipent' },
    isAccordion: false,
    isUserVerified,
    isRecipientNotVerified,
  };
};
