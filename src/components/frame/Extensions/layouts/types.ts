import type { ReactNode } from 'react';
import type { MessageDescriptor } from 'react-intl';

export interface MainLayoutProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  loadingText: MessageDescriptor | string;
  pageName: string;
  hideColonies?: boolean;
}

export interface HeaderProps {
  navBar?: ReactNode;
  txButtons?: ReactNode;
  userHub?: ReactNode;
}
