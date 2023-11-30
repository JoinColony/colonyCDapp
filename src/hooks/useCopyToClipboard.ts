import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export const useCopyToClipboard = (copyTimeOut = 2000) => {
  const [isCopied, setCopied] = useState(false);

  const handleClipboardCopy = (dataToCopy: string) => {
    setCopied(true);
    copyToClipboard(dataToCopy);
  };

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => setCopied(false), copyTimeOut);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copyTimeOut, isCopied]);

  return {
    isCopied,
    handleClipboardCopy,
  };
};
