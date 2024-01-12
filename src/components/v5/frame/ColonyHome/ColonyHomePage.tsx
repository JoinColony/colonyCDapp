import React from 'react';

import { ColonyDashboardProvider } from '~context/ColonyDashboardContext';

import ColonyHome from './ColonyHome';

const ColonyHomePage = () => {
  return (
    <ColonyDashboardProvider>
      <ColonyHome />
    </ColonyDashboardProvider>
  );
};

export default ColonyHomePage;
