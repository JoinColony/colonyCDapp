import { Editor } from '@tiptap/react';
import { DescriptionFieldProps } from '~v5/common/ActionSidebar/partials/DescriptionField/types';

export type MenuBarProps = {
  editor: Editor | null;
};

export type RichTextProps = Omit<DescriptionFieldProps, 'fieldName'> & {
  name: string;
  isReadonly?: boolean;
  shouldFocus?: boolean;
};
