import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export const useCopyToClipboard = (dataToCopy: string) => {
  const [isCopied, setCopied] = useState(false);

  const handleClipboardCopy = () => {
    setCopied(true);
    copyToClipboard(dataToCopy);
  };

  useEffect(() => {
    let timeout;
    if (isCopied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCopied]);

  return {
    isCopied,
    handleClipboardCopy,
  };
};
