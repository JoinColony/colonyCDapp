import React, { type FC } from 'react';

import ColonyIcon from '~icons/ColonyIcon.tsx';
import ColonyLogo from '~images/logo-new.svg?react';

const SimpleSidebar: FC = () => {
  return (
    <nav className="flex h-full flex-col items-center justify-between rounded-lg border border-gray-200 px-4 pb-6 pt-4 text-center ">
      <div className="flex h-11 w-11 items-center justify-center">
        <ColonyIcon size={34} />
      </div>
      <ColonyLogo />
    </nav>
  );
};

export default SimpleSidebar;
