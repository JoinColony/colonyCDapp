import React, { FC } from 'react';

import NavigationSidebarContextProvider from './partials/NavigationSidebarContext/NavigationSidebarContext';
import NavigationSidebarContent from './NavigationSidebarContent';
import { NavigationSidebarProps } from './types';

const displayName = 'v5.frame.NavigationSidebar';

const NavigationSidebar: FC<NavigationSidebarProps> = (props) => (
  <NavigationSidebarContextProvider>
    <NavigationSidebarContent {...props} />
  </NavigationSidebarContextProvider>
);

NavigationSidebar.displayName = displayName;

export default NavigationSidebar;
