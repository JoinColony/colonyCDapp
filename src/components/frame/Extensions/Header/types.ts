import type { ReactNode } from 'react';

import type { Colony } from '~types';

export interface HeaderProps {
  colony?: Colony;
  navBar?: ReactNode;
  txButtons?: ReactNode;
  userHub?: ReactNode;
}
