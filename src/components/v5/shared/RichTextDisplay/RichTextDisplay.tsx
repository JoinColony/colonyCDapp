import clsx from 'clsx';
import DOMPurify from 'dompurify';
import React from 'react';

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
    ? DOMPurify.sanitize(content)
    : DOMPurify.sanitize(content, { ALLOWED_TAGS: [], KEEP_CONTENT: true });

  return (
    <div
      className={clsx('prose text-gray-900 text-md', className)}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
};

RichTextDisplay.displayName = displayName;
export default RichTextDisplay;
