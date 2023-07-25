import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

export const useInput = (maxCharNumber: number, defaultValue?: string) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentCharNumber, setCurrentCharNumber] = useState(0);

  const defaultValueLength = defaultValue?.length;

  const isCharLenghtError = useMemo(
    () => currentCharNumber > maxCharNumber,
    [currentCharNumber, maxCharNumber],
  );

  const onChangeTyping = useCallback(() => setIsTyping(false), []);

  const debounced = useMemo(
    () => debounce(onChangeTyping, 1000),
    [onChangeTyping],
  );

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback(
    (e) => {
      setIsTyping(true);
      const { value } = e.target;
      setCurrentCharNumber(value.length);
      debounced(value);
    },
    [debounced],
  );

  useEffect(() => {
    if (!defaultValueLength) return;
    setCurrentCharNumber(defaultValueLength);
  }, [defaultValueLength]);

  return {
    isTyping,
    isCharLenghtError,
    setIsTyping,
    debounced,
    currentCharNumber,
    onChange,
  };
};
