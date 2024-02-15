import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { type DeepPartial } from 'utility-types';

import { useColonyContext } from '~context/ColonyContext.tsx';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.tsx';

import { useActionFormBaseHook } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

import { type MintTokenFormValues, validationSchema } from './consts.ts';
import { getMintTokenPayload } from './utils.tsx';

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
        createdIn: Id.RootDomain,
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
          return getMintTokenPayload(colony, values);
        }),
      ),
      [colony],
    ),
  });
};
