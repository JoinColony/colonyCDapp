import React, { type FC } from 'react';

import ColonyIcon from '~icons/ColonyIcon.tsx';

const SimpleSidebar: FC = () => {
  return (
    <nav className="h-full rounded-lg border border-gray-200 p-4 text-center">
      <ColonyIcon size={34} />
      {/* @TODO: Add feedback button? */}
    </nav>
  );
};

export default SimpleSidebar;
