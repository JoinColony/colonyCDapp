import React from 'react';

import { useMobile } from '~hooks/index.ts';
import SubNavigationComponent, {
  SubNavigationMobile,
} from '~v5/common/SubNavigation/index.ts';

const SubNavigation = () => {
  const isMobile = useMobile();

  return isMobile ? <SubNavigationMobile /> : <SubNavigationComponent />;
};

export default SubNavigation;
