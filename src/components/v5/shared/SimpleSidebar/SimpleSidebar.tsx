import React, { FC } from 'react';

import Icon from '~shared/Icon';
import ColonyLogo from '~images/logo-new.svg';

const SimpleSidebar: FC = () => {
  return (
    <nav className="flex flex-col items-center justify-between border text-center border-gray-200 rounded-lg p-4 h-full ">
      <Icon appearance={{ size: 'extraBig' }} name="colony-icon" />
      <ColonyLogo />
    </nav>
  );
};

export default SimpleSidebar;
