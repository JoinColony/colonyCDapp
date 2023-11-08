import { Outlet } from 'react-router-dom';
import React from 'react';

import { MainLayout } from '~frame/Extensions/layouts';
import WizardContextProvider from '~context/WizardContext';

import WizardSidebar from './WizardSidebar';
import { wizardSidebarMSGs, wizardSteps } from './utils';

const WizardRoute = () => (
  <WizardContextProvider>
    <MainLayout
      sidebar={
        <WizardSidebar
          wizardSteps={wizardSteps}
          sidebarTitle={wizardSidebarMSGs.sidebarTitle}
          sidebarTitleValues={{
            isCreatingColony:
              window.location.pathname.includes('/create-colony/'),
          }}
        />
      }
      hasWideSidebar
    >
      <Outlet />
    </MainLayout>
  </WizardContextProvider>
);

export default WizardRoute;
