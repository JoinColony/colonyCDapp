import { useState, useCallback, useEffect } from 'react';

import { RefRegistryEntry, UseToggleReturnType } from './types';

let documentClickHandlerRegistered = false;
const refsRegistry: RefRegistryEntry[] = [];

const documentClickHandler = (event: MouseEvent): void => {
  refsRegistry.forEach(({ element, toggleOff, toggleState }) => {
    if (toggleState && !element.contains(event.target as Node)) {
      toggleOff();
    }
  });
};

const useToggle = ({
  defaultToggleState = false,
} = {}): UseToggleReturnType => {
  const [toggleState, setToggleState] = useState(defaultToggleState);

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
