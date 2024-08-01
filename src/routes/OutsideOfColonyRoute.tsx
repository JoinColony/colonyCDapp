import React from 'react';
import { Outlet } from 'react-router-dom';

import { BasicPageLayout } from '~frame/Extensions/layouts/index.ts';

const OutsideOfColonyRoute = () => (
  <BasicPageLayout>
    <Outlet />
  </BasicPageLayout>
);

export default OutsideOfColonyRoute;
