import copyToClipboard from 'copy-to-clipboard';
import { useCallback, useEffect, useRef, useState } from 'react';

const useCopyToClipboard = (copyTimeOut = 2000) => {
  const [isCopied, setCopied] = useState(false);

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const handleClipboardCopy = (dataToCopy: string) => {
    clearTimeout(timeout.current); // Clear any existing timeout
    setCopied(true);
    copyToClipboard(dataToCopy);
    timeout.current = setTimeout(() => setCopied(false), copyTimeOut);
  };

  const resetCopiedState = useCallback(() => {
    clearTimeout(timeout.current);
    setCopied(false);
  }, []);

  useEffect(() => {
    return resetCopiedState; // Cleanup on unmount
  }, [resetCopiedState]);

  return {
    isCopied,
    handleClipboardCopy,
    resetCopiedState,
  };
};

export default useCopyToClipboard;
