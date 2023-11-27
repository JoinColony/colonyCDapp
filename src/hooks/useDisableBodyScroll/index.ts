import { useEffect } from 'react';

import { disableScrollOnBody, enableScrollOnBody } from './utils';

let disableCallsCount = 0;

const useDisableBodyScroll = (condition: boolean | (() => boolean)): void => {
  const conditionMet =
    typeof condition === 'function' ? condition() : condition;

  useEffect(() => {
    if (conditionMet) {
      disableCallsCount += 1;

      disableScrollOnBody();
    } else if (disableCallsCount <= 1) {
      enableScrollOnBody();
    } else {
      disableCallsCount -= 1;
    }

    return () => {
      if (disableCallsCount > 0) {
        disableCallsCount -= 1;
        return;
      }

      enableScrollOnBody();
    };
  }, [conditionMet]);
};

export default useDisableBodyScroll;
