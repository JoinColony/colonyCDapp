import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { DeepPartial } from 'utility-types';
import { useWatch } from 'react-hook-form';

import { ActionTypes } from '~redux';
import { useColonyContext } from '~hooks';
import { mapPayload, pipe } from '~utils/actions';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts';

import { ActionFormBaseProps } from '../../../types';
import { DecisionMethod, useActionFormBaseHook } from '../../../hooks';
import { MintTokenFormValues, validationSchema } from './consts';
import { getMintTokenPayload } from './utils';

export const useMintToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo<DeepPartial<MintTokenFormValues>>(
      () => ({
        createdIn: Id.RootDomain.toString(),
        amount: {},
      }),
      [],
    ),
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.ACTION_MINT_TOKENS
        : ActionTypes.ROOT_MOTION,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((values: MintTokenFormValues) => {
          if (!colony) {
            return null;
          }

          return getMintTokenPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
