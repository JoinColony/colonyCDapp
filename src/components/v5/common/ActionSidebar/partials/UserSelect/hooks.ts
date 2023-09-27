import { isHexString } from 'ethers/lib/utils';
import {
  useColonyContext,
  useGetColonyMembers as useGetColonyMembersToVerify,
} from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';
import { getVerifiedUsers } from '~utils/verifiedUsers';
import { splitWalletAddress } from '~utils/splitWalletAddress';
// import { useGetVerifiedMembersQuery } from '~gql';

export const useUserSelect = (recipient): UserSelectHookProps => {
  const { colony } = useColonyContext();
  const { colonyAddress = '' } = colony ?? {};
  const { members, loading } = useGetColonyMembers(colonyAddress);

  // @TODO: use that hook when returns any data
  // const { data } = useGetVerifiedMembersQuery({
  //   variables: { colonyAddress },
  //   skip: !colonyAddress,
  // });

  const allColonyMembers = useGetColonyMembersToVerify(colony?.colonyAddress);

  const verifiedUsers = getVerifiedUsers(
    colony?.metadata?.whitelistedAddresses ?? [],
    allColonyMembers,
  );

  const isUserVerified = verifiedUsers.some(
    (user) => user.walletAddress === recipient,
  );

  const users = members?.map((member) => {
    const { label, walletAddress, avatar } = member || {};

    return {
      label: label || '',
      value: walletAddress || '',
      avatar: avatar || '',
      walletAddress: walletAddress || '',
      showAvatar: true,
    };
  });

  const isRecipientNotVerified: boolean = recipient && !isUserVerified;

  const userFormat: string =
    isHexString(recipient) && recipient
      ? splitWalletAddress(recipient)
      : recipient;

  return {
    loading,
    options: users || [],
    key: 'users',
    title: { id: 'actions.recipent' },
    isAccordion: false,
    isUserVerified,
    isRecipientNotVerified,
    userFormat,
  };
};
