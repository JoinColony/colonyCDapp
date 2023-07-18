import { MessageDescriptor } from 'react-intl';

export interface PageLayoutProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  loadingText: MessageDescriptor | string;
  pageName: 'members' | 'extensions' | 'profile';
  hideColonies?: boolean;
}
