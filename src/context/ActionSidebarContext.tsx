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
  uploaderModalToggle: UseToggleReturnType;
}>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  avatarModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  uploaderModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
});

export const ActionSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const cancelModalToggle = useToggle();
  const avatarModalToggle = useToggle();
  const actionSidebarToggle = useToggle();
  const [
    ,
    {
      useRegisterOnBeforeCloseCallback:
        actionSidebarUseRegisterOnBeforeCloseCallback,
    },
  ] = actionSidebarToggle;
  const uploaderModalToggle = useToggle();

  actionSidebarUseRegisterOnBeforeCloseCallback((element) => {
    const reactModalPortals = Array.from(
      document.querySelectorAll('.ReactModalPortal'),
    );

    // Element inside the modal or in the portal container
    if (
      getPortalContainer().contains(element) ||
      reactModalPortals.some((portal) => portal.contains(element))
    ) {
      return false;
    }

    return undefined;
  });

  const value = useMemo(
    () => ({
      actionSidebarToggle,
      cancelModalToggle,
      avatarModalToggle,
      uploaderModalToggle,
    }),
    [
      actionSidebarToggle,
      cancelModalToggle,
      avatarModalToggle,
      uploaderModalToggle,
    ],
  );

  return (
    <ActionSidebarContext.Provider {...{ value }}>
      {children}
    </ActionSidebarContext.Provider>
  );
};

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
