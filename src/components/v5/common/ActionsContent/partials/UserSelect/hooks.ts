import { useColonyContext } from '~hooks';
import { useGetColonyMembers } from '~v5/shared/MembersSelect/hooks';
import { UserSelectHookProps } from './types';

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
