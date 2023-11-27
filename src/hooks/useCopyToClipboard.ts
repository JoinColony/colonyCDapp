import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export const useCopyToClipboard = (dataToCopy = '', copyTimeOut = 2000) => {
  const [isCopied, setCopied] = useState(false);

  const handleClipboardCopy = (dataToCopyParam?: string) => {
    setCopied(true);
    copyToClipboard(dataToCopyParam || dataToCopy);
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
