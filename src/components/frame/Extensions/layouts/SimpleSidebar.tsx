import React, { type FC } from 'react';

import ColonyIcon from '~icons/ColonyIcon.tsx';

const SimpleSidebar: FC = () => {
  return (
    <nav className="border text-center border-gray-200 rounded-lg p-4 h-full">
      <ColonyIcon size={34} />
      {/* @TODO: Add feedback button? */}
    </nav>
  );
};

export default SimpleSidebar;
