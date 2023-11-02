import { Outlet } from 'react-router-dom';
import React from 'react';
import { MainLayout } from '~frame/Extensions/layouts';

import WizardSidebar from './WizardSidebar';
import { wizardSidebarMSGs, wizardSteps } from './utils';
import WizardContextProvider from '~context/WizardContext';

const WizardRoute = () => (
  <WizardContextProvider>
    <MainLayout
      sidebar={
        <WizardSidebar
          wizardSteps={wizardSteps}
          sidebarTitle={wizardSidebarMSGs.sidebarTitle}
        />
      }
      hasWideSidebar
    >
      <Outlet />
    </MainLayout>
  </WizardContextProvider>
);

export default WizardRoute;
