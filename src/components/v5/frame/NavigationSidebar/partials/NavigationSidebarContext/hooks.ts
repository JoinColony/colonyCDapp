import { useContext } from 'react';
import { NavigationSidebarContext } from './NavigationSidebarContext';
import { NavigationSidebarContextValue } from './types';

const useNavigationSidebarContext = (): NavigationSidebarContextValue =>
  useContext(NavigationSidebarContext);

export default useNavigationSidebarContext;
