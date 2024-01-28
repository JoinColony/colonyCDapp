import { type Dispatch, type SetStateAction } from 'react';

import { type UseToggleReturnType } from '~hooks/useToggle/types.ts';

export interface NavigationSidebarContextValue {
  openItemIndex: number | undefined;
  setOpenItemIndex: (index: number | undefined) => void;
  setShouldShowThirdLevel: Dispatch<SetStateAction<boolean>>;
  mobileMenuToggle: UseToggleReturnType;
  secondLevelMenuToggle: UseToggleReturnType;
  thirdLevelMenuToggle: UseToggleReturnType;
}
