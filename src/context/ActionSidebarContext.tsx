import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';

import noop from '~utils/noop';

export const ActionSidebarContext = createContext<{
  isActionSidebarOpen: boolean;
  setisActionSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isActionSidebarOpen: false,
  setisActionSidebarOpen: noop,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isActionSidebarOpen, setisActionSidebarOpen] = useState(false);

  const value = useMemo(
    () => ({ isActionSidebarOpen, setisActionSidebarOpen }),
    [isActionSidebarOpen],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
