import React, { FC } from 'react';

import Spinner from '~shared/Extensions/Spinner';

const displayName = 'frame.Extensions.pages.PermissionsPage';

const PermissionsPage: FC = () => <Spinner loadingText="permissionsPage">Permissions page</Spinner>;

PermissionsPage.displayName = displayName;

export default PermissionsPage;
