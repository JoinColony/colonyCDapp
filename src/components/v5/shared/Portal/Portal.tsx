import React, { FC } from 'react';
import { Portal as LibPortal, PortalProps } from 'react-portal';

import { getPortalContainer } from './utils';

const displayName = 'v5.Portal';

const Portal: FC<PortalProps> = ({ children, ...rest }) => (
  <LibPortal node={getPortalContainer()} {...rest}>
    {children}
  </LibPortal>
);

Portal.displayName = displayName;

export default Portal;
