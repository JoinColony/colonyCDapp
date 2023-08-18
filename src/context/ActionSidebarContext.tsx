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
  selectedAction: Actions | null;
  setSelectedAction: React.Dispatch<React.SetStateAction<Actions | null>>;
  toggleActionBar: () => void;
  toggleActionSidebarOff: () => void;
}>({
  isActionSidebarOpen: false,
  selectedAction: null,
  toggleActionBar: noop,
  setSelectedAction: noop,
  toggleActionSidebarOff: noop,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [
    isActionSidebarOpen,
    { toggle: toggleActionBar, toggleOff: toggleActionSidebarOff },
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
      toggleActionBar,
      toggleActionSidebarOff,
      setSelectedAction,
      selectedAction,
    }),
    [
      isActionSidebarOpen,
      selectedAction,
      setSelectedAction,
      toggleActionBar,
      toggleActionSidebarOff,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
