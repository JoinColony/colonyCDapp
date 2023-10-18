import type { ReactNode } from 'react';
import type { MessageDescriptor } from 'react-intl';

import type { Colony } from '~types';

export interface ColonyLayoutProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  loadingText: MessageDescriptor | string;
  pageName: string;
  hideColonies?: boolean;
}

export interface HeaderProps {
  colony?: Colony;
  navBar?: ReactNode;
  txButtons?: ReactNode;
  userHub?: ReactNode;
}
