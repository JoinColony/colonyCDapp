import { useWatch } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';

// FIXME: What should we do with this?
// THIS USED TO BE EXPORTED. DEACTIVATED TO SEE WHAT BREAKS
export const useActiveActionType = () => {
  const activeActionType: Action | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  return activeActionType;
};
