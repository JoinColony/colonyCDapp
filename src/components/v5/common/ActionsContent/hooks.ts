import { useState } from 'react';
import { Actions } from '~constants/actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useUserByName } from '~hooks';
import useToggle from '~hooks/useToggle';

export const useActionsContent = () => {
  const { selectedAction } = useActionSidebarContext();

  const [isTeamSelectVisible, { toggle: toggleTeamSelect }] = useToggle();
  const [isUserSelectVisible, { toggle: toggleUserSelect }] = useToggle();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const shouldShowFromField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.TRANSFER_FUNDS ||
    selectedAction === Actions.ADVANCED_PAYMENT;

  const shouldShowUserField =
    selectedAction === Actions.SIMPLE_PAYMENT ||
    selectedAction === Actions.ADVANCED_PAYMENT;

  const shouldShowAmountField = selectedAction === Actions.SIMPLE_PAYMENT;

  const { user } = useUserByName(selectedUser || '');
  const userDisplayName = user?.profile?.displayName;
  const username = user?.name;

  return {
    isTeamSelectVisible,
    isUserSelectVisible,
    selectedTeam,
    selectedUser,
    toggleTeamSelect,
    toggleUserSelect,
    setSelectedTeam,
    setSelectedUser,
    shouldShowFromField,
    shouldShowUserField,
    shouldShowAmountField,
    userDisplayName,
    username,
    user,
  };
};
