import React from 'react';

import SubNavigationComponent, { SubNavigationMobile } from '~common/Extensions/SubNavigation';

const SubNavigation = () => {
  return (
    <>
      <div className="hidden md:block">
        <SubNavigationComponent />
      </div>
      <div className="md:hidden">
        <SubNavigationMobile />
      </div>
    </>
  );
};

export default SubNavigation;
