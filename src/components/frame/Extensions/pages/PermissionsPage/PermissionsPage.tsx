import React, { FC } from 'react';

import Navigation from '~common/Extensions/Navigation';
import TwoColumns from '~frame/Extensions/TwoColumns';
import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.PermissionsPage';

const PermissionsPage: FC = () => (
  <Spinner loadingText="permissionsPage">
    <TwoColumns aside={<Navigation />}>Permissions page</TwoColumns>
  </Spinner>
);

PermissionsPage.displayName = displayName;

export default PermissionsPage;
