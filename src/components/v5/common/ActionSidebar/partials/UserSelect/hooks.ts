import { isHexString } from 'ethers/lib/utils';
import { useColonyContext } from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { splitWalletAddress } from '~utils/splitWalletAddress';
import { useGetVerifiedMembersQuery } from '~gql';

export const useUserSelect = (inputValue: string): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { colonyAddress = '', metadata } = colony ?? {};
  const { members, loading } = useGetColonyMembers(colonyAddress);
  const { data } = useGetVerifiedMembersQuery({
    variables: { colonyAddress },
    skip: !colonyAddress,
  });
  const isWhitelistActivated = metadata?.isWhitelistActivated;

  const transformMember = (member) => {
    const { label, walletAddress, avatar } = member || {};

    return {
      label: label || '',
      value: walletAddress || '',
      avatar: avatar || '',
      walletAddress: walletAddress || '',
      showAvatar: true,
    };
  };

  const prepareVerifiedUsers =
    data?.getContributorsByColony?.items?.map(transformMember);
  const users = members?.map(transformMember);

  const isUserVerified = data?.getContributorsByColony?.items.some(
    (item) =>
      item?.user?.profile?.displayName === inputValue ||
      item?.user?.walletAddress === inputValue,
  );

  const isRecipientNotVerified: boolean = !!inputValue && !isUserVerified;

  const userFormat: string =
    isHexString(inputValue) && inputValue
      ? splitWalletAddress(inputValue)
      : inputValue;

  return {
    loading,
    options: isWhitelistActivated ? prepareVerifiedUsers : users || [],
    key: 'users',
    title: { id: 'actions.recipent' },
    isAccordion: false,
    isUserVerified,
    isRecipientNotVerified,
    userFormat,
  };
};
