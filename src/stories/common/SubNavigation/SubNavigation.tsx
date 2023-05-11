import React from 'react';

import SubNavigationComponent, { SubNavigationMobile } from '~common/Extensions/SubNavigation';
import { useMobile } from '~hooks';

const SubNavigation = () => {
  const isMobile = useMobile();

  return isMobile ? <SubNavigationMobile /> : <SubNavigationComponent />;
};

export default SubNavigation;
