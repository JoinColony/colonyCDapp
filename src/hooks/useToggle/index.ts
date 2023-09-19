import { useState, useCallback, useEffect, useRef } from 'react';

import {
  RefRegistryEntry,
  ShouldCloseCallback,
  UseToggleReturnType,
} from './types';

let documentClickHandlerRegistered = false;
let htmlElementInstance: HTMLElement | null = null;
const refsRegistry: RefRegistryEntry[] = [];

const getHtmlElement = (): HTMLElement | null => {
  if (htmlElementInstance) {
    return htmlElementInstance;
  }

  htmlElementInstance = document.querySelector('html');

  return htmlElementInstance;
};

const documentClickHandler = (event: MouseEvent): void => {
  refsRegistry.forEach(
    ({ element, toggleOff, toggleState, shouldCloseCallbackRef }) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const htmlElement = getHtmlElement();

      if (
        !htmlElement ||
        !htmlElement.contains(event.target) ||
        element.contains(event.target) ||
        !toggleState
      ) {
        return;
      }

      const shouldClose =
        shouldCloseCallbackRef.current &&
        shouldCloseCallbackRef.current(element);

      if (!shouldClose) {
        return;
      }

      toggleOff();
    },
  );
};

const useToggle = ({
  defaultToggleState = false,
  shouldCloseOnDocumentClick,
}: {
  defaultToggleState?: boolean;
  shouldCloseOnDocumentClick?: ShouldCloseCallback;
} = {}): UseToggleReturnType => {
  const [toggleState, setToggleState] = useState(defaultToggleState);
  const shouldCloseCallbackRef = useRef(shouldCloseOnDocumentClick);

  shouldCloseCallbackRef.current = shouldCloseOnDocumentClick;

  const toggle = useCallback(() => {
    setTimeout(() => {
      setToggleState((currentToggleState) => !currentToggleState);
    });
  }, []);

  const toggleOff = useCallback(() => {
    setTimeout(() => {
      setToggleState(false);
    });
  }, []);

  const toggleOn = useCallback(() => {
    setTimeout(() => {
      setToggleState(true);
    });
  }, []);

  useEffect(() => {
    if (!documentClickHandlerRegistered) {
      documentClickHandlerRegistered = true;
      document.addEventListener('click', documentClickHandler);
    }
  }, []);

  const registerContainerRef = useCallback(
    (ref: HTMLElement | null): void => {
      const currentEntryIndex = refsRegistry.findIndex(
        ({ toggleOff: entryToggleOff }) => entryToggleOff === toggleOff,
      );

      if (!ref && currentEntryIndex >= 0) {
        refsRegistry.splice(currentEntryIndex, 1);

        return;
      }

      if (ref && currentEntryIndex < 0) {
        refsRegistry.push({
          shouldCloseCallbackRef,
          element: ref,
          toggleOff,
          toggleState,
        });
      }
    },
    [toggleOff, toggleState],
  );

  return [toggleState, { toggle, toggleOn, toggleOff, registerContainerRef }];
};

export default useToggle;
