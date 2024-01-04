import React from 'react';

import { useMobile } from '~hooks';
import SubNavigationComponent, {
  SubNavigationMobile,
} from '~v5/common/SubNavigation';

const SubNavigation = () => {
  const isMobile = useMobile();

  return isMobile ? <SubNavigationMobile /> : <SubNavigationComponent />;
};

export default SubNavigation;
