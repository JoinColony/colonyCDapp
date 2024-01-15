import React from 'react';
import { Outlet } from 'react-router-dom';

import { ColonyHomeProvider, useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';

const ColonyHomeRoutes = () => {
  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));

  return (
    <ColonyHomeProvider>
      <Outlet />
    </ColonyHomeProvider>
  );
};

export default ColonyHomeRoutes;
