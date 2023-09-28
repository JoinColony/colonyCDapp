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
import { getPortalContainer } from '~v5/shared/Portal/utils';

export const ActionSidebarContext = createContext<{
  actionSidebarToggle: UseToggleReturnType;
  cancelModalToggle: UseToggleReturnType;
  avatarModalToggle: UseToggleReturnType;
  changeActionModalToggle: UseToggleReturnType;
}>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  avatarModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  changeActionModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const cancelModalToggle = useToggle();
  const changeActionModalToggle = useToggle();
  const avatarModalToggle = useToggle();
  const actionSidebarToggle = useToggle({
    shouldCloseOnDocumentClick: (element) => {
      return (
        !cancelModalToggle[0] &&
        !avatarModalToggle[0] &&
        !changeActionModalToggle[0] &&
        !getPortalContainer().contains(element)
      );
    },
  });

  const value = useMemo(
    () => ({
      actionSidebarToggle,
      cancelModalToggle,
      avatarModalToggle,
      changeActionModalToggle,
    }),
    [
      actionSidebarToggle,
      cancelModalToggle,
      avatarModalToggle,
      changeActionModalToggle,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
