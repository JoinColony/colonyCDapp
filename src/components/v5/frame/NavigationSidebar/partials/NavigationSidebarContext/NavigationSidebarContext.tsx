import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useToggle from '~hooks/useToggle';
import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts';
import { getPortalContainer } from '~v5/shared/Portal/utils';
import { NavigationSidebarContextValue } from './types';

export const NavigationSidebarContext =
  createContext<NavigationSidebarContextValue>({
    openItemIndex: undefined,
    setOpenItemIndex: () => {},
    mobileMenuToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
    secondLevelMenuToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
    thirdLevelMenuToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  });

const NavigationSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [openItemIndex, setOpenItemIndex] = useState<number | undefined>(
    undefined,
  );
  const mobileMenuToggle = useToggle({
    closeOnRouteChange: true,
  });
  const secondLevelMenuToggle = useToggle({
    closeOnRouteChange: true,
  });
  const thirdLevelMenuToggle = useToggle({
    closeOnRouteChange: true,
  });
  const [
    isSecondLevelMenuOpen,
    {
      toggleOn: toggleOnSecondLevelMenu,
      toggleOff: toggleOffSecondLevelMenu,
      useRegisterOnBeforeCloseCallback:
        secondLevelMenuUseRegisterOnBeforeCloseCallback,
    },
  ] = secondLevelMenuToggle;
  const [
    ,
    { toggleOff: toggleOffThirdLevelMenu, toggleOn: toggleOnThirdLevelMenu },
  ] = thirdLevelMenuToggle;

  secondLevelMenuUseRegisterOnBeforeCloseCallback((element) => {
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

  useEffect(() => {
    if (!isSecondLevelMenuOpen) {
      setOpenItemIndex(undefined);
      toggleOffThirdLevelMenu();
    }
  }, [isSecondLevelMenuOpen, toggleOffThirdLevelMenu]);

  useEffect(() => {
    if (openItemIndex !== undefined) {
      toggleOnSecondLevelMenu();
      toggleOnThirdLevelMenu();
    } else {
      toggleOffSecondLevelMenu();
    }
  }, [
    openItemIndex,
    toggleOffSecondLevelMenu,
    toggleOnSecondLevelMenu,
    toggleOnThirdLevelMenu,
  ]);

  const value = useMemo(
    () => ({
      openItemIndex,
      setOpenItemIndex,
      mobileMenuToggle,
      secondLevelMenuToggle,
      thirdLevelMenuToggle,
    }),
    [
      mobileMenuToggle,
      openItemIndex,
      secondLevelMenuToggle,
      thirdLevelMenuToggle,
    ],
  );

  return (
    <NavigationSidebarContext.Provider value={value}>
      {children}
    </NavigationSidebarContext.Provider>
  );
};

export default NavigationSidebarContextProvider;
