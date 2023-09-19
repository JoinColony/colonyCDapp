import { useEffect, useRef } from 'react';
import { GLOBAL_EVENTS } from '~utils/browser/dispatchGlobalEvent/consts';

const useGlobalEventHandler = <TDetail>(
  eventName: keyof typeof GLOBAL_EVENTS,
  handler: (event: CustomEvent<TDetail>) => void,
) => {
  const handlerRef = useRef(handler);

  handlerRef.current = handler;

  useEffect(() => {
    const eventHandler = (event: CustomEvent<TDetail>): void => {
      handlerRef.current(event);
    };

    window.addEventListener(eventName, eventHandler);

    return (): void => {
      window.removeEventListener(eventName, eventHandler);
    };
  }, [eventName]);
};

export default useGlobalEventHandler;
