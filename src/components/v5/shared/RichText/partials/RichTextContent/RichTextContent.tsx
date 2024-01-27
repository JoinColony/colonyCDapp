import { EditorContent } from '@tiptap/react';
import clsx from 'clsx';
import React from 'react';

import { RichTextContentProps } from './types.ts';

import styles from './RichTextContent.module.css';

const displayName = 'v5.RichText.partials.RichTextContent';

const RichTextContent: React.FC<RichTextContentProps> = ({
  className,
  ...props
}) => (
  <EditorContent
    className={clsx(styles.richTextContent, className)}
    {...props}
  />
);

RichTextContent.displayName = displayName;

export default RichTextContent;
