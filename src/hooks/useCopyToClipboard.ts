import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';

export const useCopyToClipboard = (dataToCopy: string) => {
  const [copied, setCopied] = useState(false);

  const handleClipboardCopy = () => {
    setCopied(true);
    copyToClipboard(dataToCopy);
  };

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return {
    handleClipboardCopy,
  };
};
