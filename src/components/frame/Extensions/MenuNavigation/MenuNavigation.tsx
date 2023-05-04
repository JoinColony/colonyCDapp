import React from 'react';

const displayName = 'frame.Extensions.MenuNavigation';

const MenuNavigation = () => (
  <header
    className="bg-base-white max-w-[26.75rem] sm:max-w-full h-[6.6875rem] flex flex-row 
  justify-between items-center px-6"
  >
    <div className="flex flex-row justify-between items-center">
      <div className="mr-[3.5625rem]">Logo</div>
      <div className="flex flex-row items-center">
        <div className="mx-2">Dashboard</div>
        <div className="mx-2">Members</div>
        <div className="mx-2">Decisions</div>
        <div className="mx-2">More</div>
      </div>
    </div>
    <div>wallett</div>
  </header>
);

MenuNavigation.displayName = displayName;

export default MenuNavigation;
