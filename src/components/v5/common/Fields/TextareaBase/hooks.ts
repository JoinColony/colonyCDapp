import { useEffect, useRef } from 'react';
import noop from 'lodash/noop';

const useAutosizeTextArea = (
  value: string | number | readonly string[] | undefined,
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textAreaRef.current) {
      return noop;
    }
    const textArea = textAreaRef.current;
    textArea.style.height = '0px';
    const { scrollHeight } = textArea;

    textArea.style.height = `${scrollHeight}px`;

    return () => {
      textArea.style.height = '';
    };
  }, [textAreaRef, value]);

  return textAreaRef;
};

export default useAutosizeTextArea;
