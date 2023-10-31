import React from 'react';
import { Outlet } from 'react-router-dom';

import WizardLayout from './WizardLayout';

const WizardRoute = () => (
  <WizardLayout>
    <Outlet />
  </WizardLayout>
);

export default WizardRoute;
