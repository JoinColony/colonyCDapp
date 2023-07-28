import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export const useCopyToClipboard = (dataToCopy: string, copyTimeOut = 2000) => {
  const [isCopied, setCopied] = useState(false);

  const handleClipboardCopy = () => {
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
