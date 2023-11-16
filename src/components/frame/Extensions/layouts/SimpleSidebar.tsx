import React, { FC } from 'react';

import Icon from '~shared/Icon';

const SimpleSidebar: FC = () => {
  return (
    <nav className="border text-center border-gray-200 rounded-lg p-4 h-full">
      <Icon appearance={{ size: 'extraBig' }} name="colony-icon" />
      {/* @TODO: Add feedback button? */}
    </nav>
  );
};

export default SimpleSidebar;
