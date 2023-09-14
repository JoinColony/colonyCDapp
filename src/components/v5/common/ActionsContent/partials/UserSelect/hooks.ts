import { useFormContext } from 'react-hook-form';
import {
  useColonyContext,
  useGetColonyMembers as useGetColonyMembersToVerify,
} from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { getVerifiedUsers } from '~utils/verifiedUsers';

export const useUserSelect = (): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { members, loading } = useGetColonyMembers(colony?.colonyAddress);

  const users = members?.map((member) => {
    const { label, walletAddress, avatar } = member || {};

    return {
      label: label || '',
      value: label || walletAddress || '',
      avatar: avatar || '',
      walletAddress: walletAddress || '',
      showAvatar: true,
    };
  });

  return {
    loading,
    options: users || [],
    key: 'users',
    title: { id: 'actions.recipent' },
    isAccordion: false,
  };
};

export const useVerifiedRecipient = () => {
  const { colony } = useColonyContext();
  const methods = useFormContext();
  const recipient = methods?.watch('recipient');

  const isAddressVerified = (colony?.metadata?.whitelistedAddresses ?? []).some(
    (address) => address?.toLowerCase() === recipient?.toLowerCase(),
  );

  const allColonyMembers = useGetColonyMembersToVerify(colony?.colonyAddress);

  const verifiedUsers = getVerifiedUsers(
    colony?.metadata?.whitelistedAddresses ?? [],
    allColonyMembers,
  );

  const isUserVerified = verifiedUsers.some(
    (user) =>
      user.profile?.displayName?.toLowerCase() === recipient?.toLowerCase(),
  );

  return {
    isAddressVerified,
    isUserVerified,
  };
};
