import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import useToggle from '~hooks/useToggle';

import noop from '~utils/noop';

export const ActionSidebarContext = createContext<{
  isActionSidebarOpen: boolean;
  toggleActionBar: () => void;
  toggleActionSidebarOff: () => void;
}>({
  isActionSidebarOpen: false,
  toggleActionBar: noop,
  toggleActionSidebarOff: noop,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [
    isActionSidebarOpen,
    { toggle: toggleActionBar, toggleOff: toggleActionSidebarOff },
  ] = useToggle({ defaultToggleState: false });

  const value = useMemo(
    () => ({ isActionSidebarOpen, toggleActionBar, toggleActionSidebarOff }),
    [isActionSidebarOpen, toggleActionBar, toggleActionSidebarOff],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
