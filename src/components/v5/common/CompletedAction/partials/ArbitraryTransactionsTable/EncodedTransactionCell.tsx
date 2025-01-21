import clsx from 'clsx';
import React, { useState } from 'react';

import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from './translation.ts';

export const EncodedTransactionCell = ({
  encodedFunction,
}: {
  encodedFunction: string;
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const contentRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(
        contentRef.current.scrollHeight > contentRef.current.clientHeight,
      );
    }
  }, [encodedFunction]);

  const toggleTruncatedContent = () => {
    setIsExpanded((val) => !val);
  };

  return (
    <span className="mb-3 flex flex-col text-md">
      <span className="mb-3 font-medium text-gray-900">
        {formatText(MSG.transactionByteData)}:
      </span>
      <span
        ref={contentRef}
        className={clsx(' text-gray-600 break-word', {
          'line-clamp-10': !isExpanded,
        })}
      >
        {encodedFunction}
      </span>
      {isTruncated && (
        <Button
          type="button"
          onClick={toggleTruncatedContent}
          mode="link"
          className="self-end font-normal text-gray-400"
        >
          {isExpanded ? formatText(MSG.hide) : formatText(MSG.expand)}
        </Button>
      )}
    </span>
  );
};
