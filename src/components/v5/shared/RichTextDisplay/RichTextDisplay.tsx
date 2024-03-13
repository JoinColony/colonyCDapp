import clsx from 'clsx';
import React from 'react';

import { sanitizeHTML, stripHTML } from '~utils/strings/index.ts';

import styles from './RichTextDisplay.module.css';

const displayName = 'v5.RichTextDisplay';

interface RichTextDisplayProps {
  className?: string;
  content: string;
  shouldFormat?: boolean;
}

// tiptap outputs HTML strings and it requires us to spin up an entire instance of the editor in readonly mode just to display the HTML
// this component sanitized tiptap's HTML and displays it cia dangerouslySetInnerHTML
const RichTextDisplay = ({
  className,
  content,
  shouldFormat = true,
}: RichTextDisplayProps) => {
  const cleanContent = shouldFormat
    ? sanitizeHTML(content)
    : stripHTML(content);

  return (
    <div
      className={clsx(styles.richTextContent, className)}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

RichTextDisplay.displayName = displayName;
export default RichTextDisplay;
