import { useWatch } from 'react-hook-form';

import { type CoreActionOrGroup } from '~actions/index.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';

// FIXME: What should we do with this?
// THIS USED TO BE EXPORTED. DEACTIVATED TO SEE WHAT BREAKS
export const useActiveActionType = () => {
  const activeActionType: CoreActionOrGroup | undefined = useWatch({
    name: ACTION_TYPE_FIELD_NAME,
  });

  return activeActionType;
};
