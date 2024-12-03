import { Id } from '@colony/colony-js';
import { useMemo } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload } from '~utils/actions.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { validationSchema } from './consts.ts';

export const useCreateArbitraryTxs = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();

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
    transform: mapPayload((payload) => {
      const safeDescription = sanitizeHTML(payload.description || '');

      return {
        decisionMethod: payload.decisionMethod,
        description: safeDescription,
        customActionTitle: payload.title,
        transactions: payload.transactions,
        colonyAddress,
      };
    }),
  });
};
