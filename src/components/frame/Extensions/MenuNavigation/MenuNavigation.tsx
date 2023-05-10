import React from 'react';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import { useMobile } from '~hooks';

const displayName = 'frame.Extensions.MenuNavigation';

const MenuNavigation = () => {
  const isMobile = useMobile();

  return (
    <div
      className="bg-base-white w-full flex flex-row md:min-h-[6.6875rem] 
  justify-between md:px-6 border-b border-gray-200 md:border-b-0"
    >
      <div className="flex flex-col md:items-center md:flex-row w-[90rem]">
        <div className="md:mr-[2.5rem] mt-6 md:mt-0">
          <ColonySwitcher />
        </div>
        {isMobile ? (
          <div className="flex justify-between mt-6 mb-4 mx-6 md:mx-0">
            <div>Menu</div>
            <div className="ml-auto">wallett</div>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <div className="flex flex-row w-[400px]">
              <div className="mx-2">Dashboard</div>
              <div className="mx-2">Members</div>
              <div className="mx-2">Decisions</div>
              <div className="mx-2">More</div>
            </div>
            <div className="block ml-auto">wallett</div>
          </div>
        )}
      </div>
    </div>
  );
};

MenuNavigation.displayName = displayName;

export default MenuNavigation;
