import { MessageDescriptor } from 'react-intl';

export type ActionSidebarRowProps = {
  iconName: string;
  title: MessageDescriptor;
  isDescriptionFieldRow?: boolean;
  isOpened?: boolean;
  onToggle?: () => void;
  ref?: React.MutableRefObject<null>;
};
