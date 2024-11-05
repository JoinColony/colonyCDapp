import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';

import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import {
  validationSchema,
  type CreateArbitraryTxsFormValues,
} from './consts.ts';

export const useCreateArbitraryTxs = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  useActionFormBaseHook({
    actionType: ActionTypes.CREATE_ARBITRARY_TRANSACTION,
    validationSchema,
    getFormOptions,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain,
      }),
      [],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: CreateArbitraryTxsFormValues) => {
          const safeDescription = sanitizeHTML(payload.description || '');

          return {
            decisionMethod: payload.decisionMethod,
            description: safeDescription,
            customActionTitle: payload.title,
          };
        }),
      ),
      [],
    ),
  });
};
