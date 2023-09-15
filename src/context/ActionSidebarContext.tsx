import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import useToggle from '~hooks/useToggle';
import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts';
import { UseToggleReturnType } from '~hooks/useToggle/types';

export const ActionSidebarContext = createContext<{
  actionSidebarToggle: UseToggleReturnType;
  cancelModalToggle: UseToggleReturnType;
  avatarModalToggle: UseToggleReturnType;
}>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  avatarModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const actionSidebarToggle = useToggle();
  const cancelModalToggle = useToggle();
  const avatarModalToggle = useToggle();

  const value = useMemo(
    () => ({
      actionSidebarToggle,
      cancelModalToggle,
      avatarModalToggle,
    }),
    [actionSidebarToggle, cancelModalToggle, avatarModalToggle],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
