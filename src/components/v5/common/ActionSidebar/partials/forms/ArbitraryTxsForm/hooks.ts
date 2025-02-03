import { Id } from '@colony/colony-js';
import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { mapPayload } from '~utils/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains } from '~utils/domains.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import { DECISION_METHOD_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';

import { validationSchema } from './consts.ts';

export const useCreateArbitraryTxs = (
  getFormOptions: CreateActionFormProps['getFormOptions'],
) => {
  const {
    colony: { colonyAddress },
    colony,
  } = useColonyContext();

  const decisionMethod: DecisionMethod | undefined = useWatch({
    name: DECISION_METHOD_FIELD_NAME,
  });

  useActionFormBaseHook({
    actionType:
      decisionMethod === DecisionMethod.Permissions
        ? ActionTypes.CREATE_ARBITRARY_TRANSACTION
        : ActionTypes.MOTION_ARBITRARY_TRANSACTION,
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

      const commonPayload = {
        annotationMessage: safeDescription,
        customActionTitle: payload.title,
        transactions: payload.transactions,
        colonyAddress,
      };

      if (
        payload.decisionMethod === DecisionMethod.Reputation ||
        payload.decisionMethod === DecisionMethod.MultiSig
      ) {
        return {
          ...commonPayload,
          colonyRoles: extractColonyRoles(colony.roles),
          colonyDomains: extractColonyDomains(colony.domains),
          isMultiSig: payload.decisionMethod === DecisionMethod.MultiSig,
        };
      }

      return commonPayload;
    }),
  });
};
