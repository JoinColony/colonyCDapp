import React from 'react';
import SubNavigationComponent from '~shared/Extensions/SubNavigation/SubNavigation';
import SubNavigationMobile from '~shared/Extensions/SubNavigation/SubNavigationMobile/SubNavigationMobile';

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
