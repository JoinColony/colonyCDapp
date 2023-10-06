import { useEffect } from 'react';

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string | number | readonly string[] | undefined,
) => {
  useEffect(() => {
    if (textAreaRef) {
      const newTextAreaRef = textAreaRef;
      newTextAreaRef.style.height = '0px';
      const { scrollHeight } = newTextAreaRef;

      newTextAreaRef.style.height = `${scrollHeight}px`;
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;
