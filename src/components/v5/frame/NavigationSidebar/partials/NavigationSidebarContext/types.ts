import { Dispatch, SetStateAction } from 'react';

import { UseToggleReturnType } from '~hooks/useToggle/types';

export interface NavigationSidebarContextValue {
  openItemIndex: number | undefined;
  setOpenItemIndex: (index: number | undefined) => void;
  setShouldShowThirdLevel: Dispatch<SetStateAction<boolean>>;
  mobileMenuToggle: UseToggleReturnType;
  secondLevelMenuToggle: UseToggleReturnType;
  thirdLevelMenuToggle: UseToggleReturnType;
}
