import { useCallback, useRef, useState } from 'react';

type OnBeforeCloseCallback = () => Promise<boolean>;

const useAsyncToggle = () => {
  const [isOn, setOn] = useState<boolean>(false);
  const onBeforeCloseCallbacks = useRef<Set<OnBeforeCloseCallback>>(new Set());
  const registerOnBeforeCloseCallback = useCallback(
    (cb: OnBeforeCloseCallback) => {
      onBeforeCloseCallbacks.current.add(cb);
    },
    [],
  );
  const unregisterOnBeforeCloseCallback = useCallback(
    (cb: OnBeforeCloseCallback) => {
      onBeforeCloseCallbacks.current.delete(cb);
    },
    [],
  );
  const turnOn = useCallback(async () => setOn(true), []);
  const turnOff = useCallback(async () => {
    const closeResults = await Promise.all(
      Array.from(onBeforeCloseCallbacks.current).map(async (callback) =>
        callback(),
      ),
    );

    const preventClose = closeResults.some((result) => !result);

    if (preventClose) {
      console.log('Preventing the closing');
      return;
    }
    setOn(false);
  }, []);
  const toggle = useCallback(async () => {
    if (isOn) {
      return turnOff();
    }
    return turnOn();
  }, [isOn, turnOn, turnOff]);

  return {
    isOn,
    turnOn,
    turnOff,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
    toggle,
  };
};

export default useAsyncToggle;
