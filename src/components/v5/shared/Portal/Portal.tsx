import React, { type FC } from 'react';
import { Portal as LibPortal, type PortalProps } from 'react-portal';

import { getPortalContainer } from './utils.ts';

const displayName = 'v5.Portal';

const Portal: FC<PortalProps> = ({ children, ...rest }) => (
  <LibPortal node={getPortalContainer()} {...rest}>
    {children}
  </LibPortal>
);

Portal.displayName = displayName;

export default Portal;
