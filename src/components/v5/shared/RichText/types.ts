import { type Editor } from '@tiptap/react';

import { type DescriptionFieldProps } from '~v5/common/ActionSidebar/partials/DescriptionField/types.ts';

export type MenuBarProps = {
  editor: Editor | null;
};

export type RichTextProps = Omit<DescriptionFieldProps, 'fieldName'> & {
  name: string;
  isReadonly?: boolean;
  shouldFocus?: boolean;
};
