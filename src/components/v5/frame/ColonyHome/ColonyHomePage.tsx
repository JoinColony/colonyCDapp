import React from 'react';

import BalanceCurrencyContextProvider from '~context/BalanceCurrencyContext/BalanceCurrencyContextProvider.tsx';
import ColonyDashboardProvider from '~context/ColonyDashboardContext/ColonyDashboardContextProvider.tsx';

import ColonyHome from './ColonyHome.tsx';

const ColonyHomePage = () => {
  return (
    <ColonyDashboardProvider>
      <BalanceCurrencyContextProvider>
        <ColonyHome />
      </BalanceCurrencyContextProvider>
    </ColonyDashboardProvider>
  );
};

export default ColonyHomePage;
