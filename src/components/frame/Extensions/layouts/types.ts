import { MessageDescriptor } from 'react-intl';

export interface ColonyLayoutProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  loadingText: MessageDescriptor | string;
  pageName: 'members' | 'extensions' | 'profile';
  hideColonies?: boolean;
}
