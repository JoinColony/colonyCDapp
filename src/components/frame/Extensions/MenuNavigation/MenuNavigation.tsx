import React from 'react';
import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import MainNavigation from '~common/Extensions/MainNavigation';
import UserNavigation from '~frame/RouteLayouts/UserNavigation';
import { useMobile } from '~hooks';

const displayName = 'frame.Extensions.MenuNavigation';

const MenuNavigation = () => {
  const isMobile = useMobile();

  return (
    <>
      <div className="bg-base-white w-full flex flex-row sm:min-h-[6.6875rem] justify-between px-6">
        <div className="flex flex-col sm:items-center sm:flex-row w-[90rem]">
          <div className="sm:mr-[2.5rem] mt-4 sm:mt-0">
            <ColonySwitcher />
          </div>
          {isMobile ? (
            <div className="flex justify-between mt-4 mb-6 md:mx-6">
              <div className="md:ml-auto">
                <UserNavigation />
              </div>
            </div>
          ) : (
            <div className="flex justify-between w-full items-center">
              <MainNavigation />
              <div className="block ml-auto">
                <UserNavigation />
              </div>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="border-t border-gray-200 mt-3 mb-3">
          <MainNavigation />
        </div>
      )}
    </>
  );
};

MenuNavigation.displayName = displayName;

export default MenuNavigation;
