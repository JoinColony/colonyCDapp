import { useCallback, useMemo } from 'react';
import { type DeepPartial } from 'utility-types';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';

import useActionFormBaseHook from '../../../hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import {
  type EnterRecoveryModeFormValues,
  validationSchema,
} from './consts.ts';
import { getRecoveryModePayload } from './utils.tsx';

export const useEnterRecoveryMode = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType: ActionTypes.RECOVERY_MODE_ENTER,
    defaultValues: useMemo<DeepPartial<EnterRecoveryModeFormValues>>(
      () => ({}),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: EnterRecoveryModeFormValues) =>
          getRecoveryModePayload(colony, values, user),
        ),
      ),
      [colony, user],
    ),
  });
};
