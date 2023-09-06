import { MessageDescriptor } from 'react-intl';
import { ActionSidebarRowFieldNameEnum } from './enums';

export interface ActionSidebarRowProps {
  iconName: string;
  title: MessageDescriptor;
  isDescriptionFieldRow?: boolean;
  isOpened?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  isError?: boolean;
  fieldName: ActionSidebarRowFieldNameEnum;
}
