import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { useAppContext } from '~context/AppContext.tsx';
import { useColonyContext } from '~context/ColonyContext.tsx';
import { createDecisionAction } from '~redux/actionCreators/index.ts';
import { ActionTypes } from '~redux/index.ts';
import { mapPayload, pipe } from '~utils/actions.ts';
import { type DecisionDraft } from '~utils/decisions.ts';

import { useActionFormBaseHook } from '../../../hooks/index.ts';
import { type ActionFormBaseProps } from '../../../types.ts';

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

  // @TODO: checking if decision has draft status
  // const draftDecision = useSelector(
  //   getDraftDecisionFromStore(
  //     user?.walletAddress || '',
  //     colony?.colonyAddress ?? '',
  //   ),
  // );

  const handleSaveDecisionInLocalStorage = useCallback(
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
          handleSaveDecisionInLocalStorage({
            colonyAddress,
            title: payload.title,
            motionDomainId: Number(payload.createdIn),
            description: payload.description || '',
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
              description: payload.description,
              walletAddress,
            },
          };
        }),
      ),
      [],
    ),
  });
};
