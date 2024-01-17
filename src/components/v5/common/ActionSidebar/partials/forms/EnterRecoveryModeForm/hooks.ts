import { useCallback, useMemo } from 'react';
import { DeepPartial } from 'utility-types';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';

import { useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { EnterRecoveryModeFormValues, validationSchema } from './consts';
import { getRecoveryModePayload } from './utils';

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
