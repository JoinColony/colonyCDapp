import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Actions } from '~constants/actions';
import useToggle from '~hooks/useToggle';

import noop from '~utils/noop';

export const ActionSidebarContext = createContext<{
  isActionSidebarOpen: boolean;
  isCancelModalOpen: boolean;
  selectedAction: Actions | null;
  isAvatarModalOpened: boolean;
  setSelectedAction: React.Dispatch<React.SetStateAction<Actions | null>>;
  toggleActionBar: () => void;
  toggleCancelModal: () => void;
  toggleActionSidebarOff: () => void;
  toggleCancelModalOff: () => void;
  toggleChangeAvatarModalOn: () => void;
  toggleChangeAvatarModalOff: () => void;
}>({
  isActionSidebarOpen: false,
  isCancelModalOpen: false,
  selectedAction: null,
  isAvatarModalOpened: false,
  toggleActionBar: noop,
  setSelectedAction: noop,
  toggleActionSidebarOff: noop,
  toggleCancelModal: noop,
  toggleCancelModalOff: noop,
  toggleChangeAvatarModalOn: noop,
  toggleChangeAvatarModalOff: noop,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [
    isActionSidebarOpen,
    { toggle: toggleActionBar, toggleOff: toggleActionSidebarOff },
  ] = useToggle({ defaultToggleState: false });
  const [
    isCancelModalOpen,
    { toggle: toggleCancelModal, toggleOff: toggleCancelModalOff },
  ] = useToggle({ defaultToggleState: false });
  const [
    isAvatarModalOpened,
    {
      toggleOn: toggleChangeAvatarModalOn,
      toggleOff: toggleChangeAvatarModalOff,
    },
  ] = useToggle({ defaultToggleState: false });
  const [selectedAction, setSelectedAction] = useState<Actions | null>(null);

  useEffect(() => {
    if (!isActionSidebarOpen) {
      setSelectedAction(null);
      localStorage.removeItem('annotation');
    }
  }, [isActionSidebarOpen]);

  const value = useMemo(
    () => ({
      isActionSidebarOpen,
      isCancelModalOpen,
      toggleCancelModal,
      toggleCancelModalOff,
      toggleActionBar,
      toggleActionSidebarOff,
      setSelectedAction,
      selectedAction,
      isAvatarModalOpened,
      toggleChangeAvatarModalOn,
      toggleChangeAvatarModalOff,
    }),
    [
      isAvatarModalOpened,
      isActionSidebarOpen,
      isCancelModalOpen,
      selectedAction,
      toggleActionBar,
      toggleActionSidebarOff,
      toggleCancelModal,
      toggleCancelModalOff,
      toggleChangeAvatarModalOn,
      toggleChangeAvatarModalOff,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
