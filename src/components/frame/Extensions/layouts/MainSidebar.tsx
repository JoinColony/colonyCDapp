import React, { FC } from 'react';

import ColonySwitcher from '~common/Extensions/ColonySwitcher';
import { Colony } from '~types';

interface MainSidebarProps {
  colony?: Colony;
}

// @TODO: We definitely want to avoid passing the colony object here for separation of concerns. PLEASE FIX THIS
const MainSidebar: FC<MainSidebarProps> = ({ colony }) => {
  return (
    <nav className="border border-slate-300 rounded-lg p-4 h-full">
      <ColonySwitcher activeColony={colony} />
    </nav>
  );
};

export default MainSidebar;
