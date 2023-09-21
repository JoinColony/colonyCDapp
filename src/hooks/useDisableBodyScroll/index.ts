import { useEffect } from 'react';

import { disableScrollOnBody, enableScrollOnBody } from './utils';

const useDisableBodyScroll = (condition: boolean | (() => boolean)): void => {
  const conditionMet =
    typeof condition === 'function' ? condition() : condition;

  useEffect(() => {
    if (conditionMet) {
      disableScrollOnBody();
    } else {
      enableScrollOnBody();
    }
  }, [conditionMet]);
};

export default useDisableBodyScroll;
