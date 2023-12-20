import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { validationSchema, ManageReputationFormValues } from './consts';
import { getManageReputationPayload } from './utils';

export const useManageReputation = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });
  const nativeTokenDecimals = getTokenDecimalsWithFallback(
    colony?.nativeToken?.decimals,
  );

  useActionFormBaseHook({
    getFormOptions,
    validationSchema,
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MANAGE_REPUTATION
        : ActionTypes.MOTION_MANAGE_REPUTATION,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain.toString(),
        motionDomainId: Id.RootDomain,
        amount: '0',
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: ManageReputationFormValues) => {
          if (!colony) {
            return null;
          }

          return getManageReputationPayload(
            colony,
            nativeTokenDecimals,
            values,
          );
        }),
      ),
      [colony, user],
    ),
  });
};
