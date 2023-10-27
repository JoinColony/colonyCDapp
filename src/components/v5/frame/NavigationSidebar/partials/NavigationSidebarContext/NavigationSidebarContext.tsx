import React, {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useToggle from '~hooks/useToggle';
import { NavigationSidebarContextValue } from './types';

export const NavigationSidebarContext =
  createContext<NavigationSidebarContextValue>({
    openItemIndex: -1,
    setOpenItemIndex: () => {},
    isMenuOpen: false,
    toggleMenu: () => {},
    toggleOffMenu: () => {},
    isSecondLevelMenuOpen: false,
    toggleOnSecondLevelMenu: () => {},
    toggleOffSecondLevelMenu: () => {},
    registerContainerRef: () => {},
    isThirdLevelMenuOpen: false,
    toggleThirdLevelMenu: () => {},
    toggleOffThirdLevelMenu: () => {},
  });

const NavigationSidebarContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [openItemIndex, setOpenItemIndex] = useState(-1);
  const [isMenuOpen, { toggle: toggleMenu, toggleOff: toggleOffMenu }] =
    useToggle();
  const [
    isSecondLevelMenuOpen,
    {
      toggleOn: toggleOnSecondLevelMenu,
      toggleOff: toggleOffSecondLevelMenu,
      registerContainerRef,
    },
  ] = useToggle();
  const [
    isThirdLevelMenuOpen,
    { toggle: toggleThirdLevelMenu, toggleOff: toggleOffThirdLevelMenu },
  ] = useToggle();

  useEffect(() => {
    if (!isSecondLevelMenuOpen) {
      setOpenItemIndex(-1);
      toggleOffThirdLevelMenu();
    }
  }, [isSecondLevelMenuOpen, toggleOffThirdLevelMenu]);

  useEffect(() => {
    if (openItemIndex !== -1) {
      toggleOnSecondLevelMenu();
    } else {
      toggleOffSecondLevelMenu();
    }
  }, [openItemIndex, toggleOffSecondLevelMenu, toggleOnSecondLevelMenu]);

  const value = useMemo(
    () => ({
      openItemIndex,
      setOpenItemIndex,
      isMenuOpen,
      toggleMenu,
      toggleOffMenu,
      isSecondLevelMenuOpen,
      toggleOnSecondLevelMenu,
      toggleOffSecondLevelMenu,
      registerContainerRef,
      isThirdLevelMenuOpen,
      toggleThirdLevelMenu,
      toggleOffThirdLevelMenu,
    }),
    [
      isMenuOpen,
      isSecondLevelMenuOpen,
      isThirdLevelMenuOpen,
      openItemIndex,
      registerContainerRef,
      toggleMenu,
      toggleOffMenu,
      toggleOffSecondLevelMenu,
      toggleOffThirdLevelMenu,
      toggleOnSecondLevelMenu,
      toggleThirdLevelMenu,
    ],
  );

  return (
    <NavigationSidebarContext.Provider value={value}>
      {children}
    </NavigationSidebarContext.Provider>
  );
};

export default NavigationSidebarContextProvider;
