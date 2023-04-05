import React, { FC } from 'react';

import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';

const displayName = 'frame.Extensions.pages.PermissionsPage';

const PermissionsPage: FC = () => (
  <Spinner loadingText={{ id: 'loading.permissionsPage' }}>
    <TwoColumns aside={<Navigation pageName="extensions" />}>
      Permissions page
    </TwoColumns>
  </Spinner>
);

PermissionsPage.displayName = displayName;

export default PermissionsPage;
