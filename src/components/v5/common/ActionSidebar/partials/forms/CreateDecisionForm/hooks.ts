import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useDraftAgreement } from '~hooks/useDraftAgreement.ts';
import { createDecisionAction } from '~redux/actionCreators/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { type DecisionDraft } from '~utils/decisions.ts';
import { sanitizeHTML } from '~utils/strings.ts';
import useActionFormBaseHook from '~v5/common/ActionSidebar/hooks/useActionFormBaseHook.ts';
import { type ActionFormBaseProps } from '~v5/common/ActionSidebar/types.ts';

import { validationSchema, type CreateDecisionFormValues } from './consts.ts';

export const useCreateDecision = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const {
    colony: { colonyAddress, name: colonyName },
  } = useColonyContext();
  const { user } = useAppContext();
  const walletAddress = user?.walletAddress || '';
  const dispatch = useDispatch();

  const { getIsDraftAgreement } = useDraftAgreement();

  const handleSaveAgreementInLocalStorage = useCallback(
    (values: DecisionDraft) => {
      dispatch(createDecisionAction({ ...values, colonyAddress }));
    },
    [colonyAddress, dispatch],
  );

  useActionFormBaseHook({
    actionType: ActionTypes.MOTION_CREATE_DECISION,
    validationSchema,
    getFormOptions,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain,
        walletAddress,
      }),
      [walletAddress],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload: CreateDecisionFormValues) => {
          const safeDescription = sanitizeHTML(payload.description || '');

          handleSaveAgreementInLocalStorage({
            colonyAddress,
            title: payload.title,
            motionDomainId: Number(payload.createdIn),
            description: safeDescription,
            walletAddress,
          });

          return {
            colonyAddress,
            colonyName,
            decisionMethod: payload.decisionMethod,
            motionParams: [],
            draftDecision: {
              motionDomainId: Number(payload.createdIn),
              title: payload.title,
              description: safeDescription,
              walletAddress,
            },
          };
        }),
      ),
      [],
    ),
    onFormClose: {
      shouldShowCancelModal: !getIsDraftAgreement(),
    },
  });
};
