import { noop } from '~utils/noop.ts';

import { type UseToggleReturnType } from './types.ts';

export const DEFAULT_USE_TOGGLE_RETURN_VALUE: UseToggleReturnType = [
  false,
  {
    toggle: noop,
    toggleOff: noop,
    toggleOn: noop,
    registerContainerRef: noop,
    useRegisterOnBeforeCloseCallback: noop,
  },
];
