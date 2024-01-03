import React from 'react';
import { Outlet } from 'react-router-dom';

import { ColonyHomeProvider, useSetPageHeadingTitle } from '~context';
import { formatText } from '~utils/intl';

import ColonyHomeLayout from './ColonyHomeLayout';

const ColonyHomeRoutes = () => {
  useSetPageHeadingTitle(formatText({ id: 'colonyHome.title' }));

  return (
    <ColonyHomeProvider>
      <ColonyHomeLayout>
        <Outlet />
      </ColonyHomeLayout>
    </ColonyHomeProvider>
  );
};

export default ColonyHomeRoutes;
