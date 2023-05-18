import { MessageDescriptor } from 'react-intl';

export interface TitledContentProps {
  title: MessageDescriptor;
  className?: string;
  isTitleHiddenOnDesktop?: boolean;
}
