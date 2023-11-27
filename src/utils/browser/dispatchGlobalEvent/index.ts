import { GLOBAL_EVENTS } from './consts';

const dispatchGlobalEvent = <TDetail>(
  eventName: keyof typeof GLOBAL_EVENTS,
  {
    bubbles = false,
    cancelable = false,
    detail = undefined,
    composed = false,
  }: CustomEventInit<TDetail> = {},
): CustomEvent => {
  let event;

  if (typeof window.Event === 'function') {
    event = new window.CustomEvent(eventName, {
      bubbles,
      cancelable,
      composed,
      detail,
    });
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, bubbles, cancelable, detail);
  }

  setTimeout(() => {
    window.dispatchEvent(event);
  }, 1);

  return event;
};

export default dispatchGlobalEvent;
