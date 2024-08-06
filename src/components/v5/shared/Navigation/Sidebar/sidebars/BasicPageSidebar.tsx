import React from 'react';

import Sidebar from '../index.ts';

export const BasicPageSidebar = () => (
  <Sidebar
    colonySwitcherProps={{ isLogoButton: true }}
    feedbackButtonProps={{ isPopoverMode: true }}
    footerClassName="gap-[17px]"
  />
);
