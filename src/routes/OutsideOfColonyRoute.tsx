import React from 'react';
import { Outlet } from 'react-router-dom';

import { OutsideColonyLayout } from '~frame/Extensions/layouts/index.ts';

const OutsideOfColonyRoute = () => (
  <OutsideColonyLayout>
    <Outlet />
  </OutsideColonyLayout>
);

export default OutsideOfColonyRoute;
