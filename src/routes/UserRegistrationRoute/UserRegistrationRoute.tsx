import React from 'react';
import { Outlet } from 'react-router-dom';

import CreateYourColonyLayout from './CreateYourColonyLayout';

const UserRegistrationRoute = () => (
  <CreateYourColonyLayout>
    <Outlet />
  </CreateYourColonyLayout>
);

export default UserRegistrationRoute;
