import { useState, useCallback } from 'react';

import { UseToggleReturnType } from './types';

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

  return [toggleState, { toggle, toggleOn, toggleOff }];
};

export default useToggle;
