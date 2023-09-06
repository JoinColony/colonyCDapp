import { MessageDescriptor } from 'react-intl';

export interface ActionSidebarRowProps {
  iconName: string;
  title: MessageDescriptor;
  isDescriptionFieldRow?: boolean;
  isOpened?: boolean;
  onToggle?: () => void;
  isErrors?: boolean;
  children?: React.ReactNode;
}
