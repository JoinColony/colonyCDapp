import { UseToggleReturnType } from '~hooks/useToggle/types';

export interface NavigationSidebarContextValue {
  openItemIndex: number | undefined;
  setOpenItemIndex: (index: number | undefined) => void;
  mobileMenuToggle: UseToggleReturnType;
  secondLevelMenuToggle: UseToggleReturnType;
  thirdLevelMenuToggle: UseToggleReturnType;
}
