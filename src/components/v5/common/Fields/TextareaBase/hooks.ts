import noop from 'lodash/noop';
import { useEffect, useImperativeHandle, useRef } from 'react';

const useAutosizeTextArea = (
  value: string | number | readonly string[] | undefined,
  externalInputRef: React.ForwardedRef<HTMLTextAreaElement>,
) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(externalInputRef, () => {
    if (!textAreaRef.current) {
      throw new Error('Textarea ref is not available');
    }

    return textAreaRef.current;
  });

  useEffect(() => {
    if (!textAreaRef.current) {
      return noop;
    }

    const textArea = textAreaRef.current;

    // Reset the height to auto to get the correct scrollHeight for content
    textArea.style.height = 'auto';
    textArea.style.overflow = 'scroll';

    const { scrollHeight } = textArea;

    textArea.style.height = `${scrollHeight}px`;
    textArea.style.overflow = 'hidden';

    return () => {
      textArea.style.height = '';
    };
  }, [textAreaRef, value]);

  return textAreaRef;
};

export default useAutosizeTextArea;
