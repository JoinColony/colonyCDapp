import React from 'react';

import ColonyDashboardProvider from '~context/ColonyDashboardContext/ColonyDashboardContextProvider.tsx';

import ColonyHome from './ColonyHome.tsx';

const ColonyHomePage = () => {
  return (
    <ColonyDashboardProvider>
      <ColonyHome />
    </ColonyDashboardProvider>
  );
};

export default ColonyHomePage;
