import { useFormContext } from 'react-hook-form';
import {
  useColonyContext,
  useGetColonyMembers as useGetColonyMembersToVerify,
} from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { getVerifiedUsers } from '~utils/verifiedUsers';
// import { useGetVerifiedMembersQuery } from '~gql';

export const useUserSelect = (): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};
  const { members, loading } = useGetColonyMembers(colonyAddress);
  const methods = useFormContext();
  const recipient = methods?.watch('recipient');

  // @TODO: use that hook when returns any data
  // const { data } = useGetVerifiedMembersQuery({
  //   variables: { colonyAddress },
  //   skip: !colonyAddress,
  // });

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
    isAddressVerified,
    isUserVerified,
  };
};
