import React from 'react';
import { Outlet } from 'react-router-dom';

import LandingPageLayout from './LandingPageLayout';

const UserRegistrationRoute = () => (
  <LandingPageLayout>
    <Outlet />
  </LandingPageLayout>
);

export default UserRegistrationRoute;
