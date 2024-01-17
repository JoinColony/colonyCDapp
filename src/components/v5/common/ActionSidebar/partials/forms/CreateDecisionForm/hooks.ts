import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { DecisionDialogValues } from '~common/ColonyDecisions/DecisionDialog';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { createDecisionAction } from '~redux/actionCreators';
import { mapPayload, pipe } from '~utils/actions';

import { useActionFormBaseHook } from '../../../hooks';
import { ActionFormBaseProps } from '../../../types';

import { validationSchema, CreateDecisionFormValues } from './consts';

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

  const handleSaveDecisionInlocalStoage = useCallback(
    (values: DecisionDialogValues) => {
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
          handleSaveDecisionInlocalStoage({
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
              motionDomainId: payload.createdIn,
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
