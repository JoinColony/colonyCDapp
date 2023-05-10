import React, { PropsWithChildren, FC } from 'react';

import { MainNavigationProps } from './types';
import Nav from './partials/Nav/Nav';
import { navMenuItems } from './partials/Nav/consts';

const displayName = 'common.Extensions.MainNavigation';

const MainNavigation: FC<PropsWithChildren<MainNavigationProps>> = () => (
  <div>
    <Nav items={navMenuItems} />
  </div>
);

MainNavigation.displayName = displayName;

export default MainNavigation;
