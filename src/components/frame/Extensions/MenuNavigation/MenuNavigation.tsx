import React from 'react';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import { useMobile } from '~hooks';

const displayName = 'frame.Extensions.MenuNavigation';

const MenuNavigation = () => {
  const isMobile = useMobile();

  return (
    <header
      className="bg-base-white max-w-[26.75rem] sm:max-w-full h-[6.6875rem] flex flex-row 
  justify-between px-6 border-b border-gray-200 md:border-b-0"
    >
      <div className="flex flex-row md:flex-col items-center">
        <div className="mr-[3.5rem] block">
          <ColonySwitcher />
        </div>
        {isMobile ? (
          <div className="flex justify-between">
            <div>Menu</div>
            <div className="ml-auto">wallett</div>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center">
              <div className="mx-2">Dashboard</div>
              <div className="mx-2">Members</div>
              <div className="mx-2">Decisions</div>
              <div className="mx-2">More</div>
            </div>
            <div className="ml-auto">wallett</div>
          </>
        )}
      </div>
    </header>
  );
};

MenuNavigation.displayName = displayName;

export default MenuNavigation;
