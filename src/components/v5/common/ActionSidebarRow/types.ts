import { MessageDescriptor } from 'react-intl';
import { ActionSidebarRowFieldNameEnum } from './enums';

export type ActionSidebarRowProps = {
  iconName: string;
  title: MessageDescriptor;
  isDescriptionFieldRow?: boolean;
  isOpened?: boolean;
  onToggle?: () => void;
  ref?: React.MutableRefObject<null>;
  isError?: boolean;
  fieldName: ActionSidebarRowFieldNameEnum;
};
