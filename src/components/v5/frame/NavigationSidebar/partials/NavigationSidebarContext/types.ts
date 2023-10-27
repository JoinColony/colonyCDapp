export interface NavigationSidebarContextValue {
  openItemIndex: number;
  setOpenItemIndex: (index: number) => void;
  isMenuOpen: boolean;
  toggleMenu: VoidFunction;
  toggleOffMenu: VoidFunction;
  isSecondLevelMenuOpen: boolean;
  toggleOnSecondLevelMenu: VoidFunction;
  toggleOffSecondLevelMenu: VoidFunction;
  registerContainerRef: (ref: HTMLDivElement) => void;
  isThirdLevelMenuOpen: boolean;
  toggleThirdLevelMenu: VoidFunction;
  toggleOffThirdLevelMenu: VoidFunction;
}
