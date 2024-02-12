import React, { type FC } from 'react';

import ColonyIcon from '~icons/ColonyIcon.tsx';
import ColonyLogo from '~images/logo-new.svg?react';

const SimpleSidebar: FC = () => {
  return (
    <nav className="flex flex-col items-center justify-between border text-center border-gray-200 rounded-lg px-4 pt-4 pb-6 h-full ">
      <div className="flex items-center justify-center w-11 h-11">
        <ColonyIcon size={34} />
      </div>
      <ColonyLogo />
    </nav>
  );
};

export default SimpleSidebar;
