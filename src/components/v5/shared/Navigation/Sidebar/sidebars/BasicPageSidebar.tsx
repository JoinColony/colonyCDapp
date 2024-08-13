import React from 'react';

import Sidebar from '../index.ts';

export const BasicPageSidebar = () => (
  <Sidebar
    colonySwitcherProps={{ isLogoButton: true, offset: [-20, 22] }}
    feedbackButtonProps={{ isPopoverMode: true }}
    className="!items-center"
    footerClassName="!items-center"
  />
);
