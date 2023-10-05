import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Id } from '@colony/colony-js';
import { useCallback, useMemo } from 'react';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { DecisionDialogValues } from '~common/ColonyDecisions/DecisionDialog';
import { createDecisionAction } from '~redux/actionCreators';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const validationSchema = yup
  .object()
  .shape({
    title: yup
      .string()
      .trim()
      .required(() => 'Please enter a title'),
    createdIn: yup.string().defined(),
    description: yup
      .string()
      .notOneOf(['<p></p>'], () => 'Please enter a description')
      .defined(),
    walletAddress: yup.string().address().required(),
  })
  .defined();

export const useCreateDecision = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const colonyAddress = colony?.colonyAddress ?? '';
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
        createdIn: Id.RootDomain.toString(),
        title: '',
        description: '',
        walletAddress,
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
      }),
      [walletAddress],
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          handleSaveDecisionInlocalStoage({
            title: payload.title,
            motionDomainId: payload.createdIn,
            description: payload.description,
            walletAddress,
          });

          return {
            colonyAddress,
            colonyName: colony?.name,
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
      [colony],
    ),
  });
};
