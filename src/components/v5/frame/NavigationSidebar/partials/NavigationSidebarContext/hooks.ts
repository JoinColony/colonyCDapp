import { useContext } from 'react';

import { NavigationSidebarContext } from './NavigationSidebarContext.tsx';
import { NavigationSidebarContextValue } from './types.ts';

const useNavigationSidebarContext = (): NavigationSidebarContextValue =>
  useContext(NavigationSidebarContext);

export default useNavigationSidebarContext;
