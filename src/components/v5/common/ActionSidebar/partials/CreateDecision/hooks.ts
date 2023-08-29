import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useAppContext, useColonyContext } from '~hooks';
import { useActionHook } from '../ActionForm/hooks';
import { DecisionDialogValues } from '~common/ColonyDecisions/DecisionDialog';
import { createDecisionAction } from '~redux/actionCreators';

export const useCreateDecision = () => {
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

  const handleSaveDecisionInlocalStoage = (values: DecisionDialogValues) => {
    dispatch(createDecisionAction({ ...values, colonyAddress }));
  };

  const transform = pipe(
    mapPayload((payload) => {
      handleSaveDecisionInlocalStoage({
        title: payload.title,
        motionDomainId: payload.createdIn,
        description: payload.annotation,
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
          description: payload.annotation,
          walletAddress,
        },
      };
    }),
  );

  const validationSchema = yup
    .object()
    .shape({
      title: yup
        .string()
        .trim()
        .required(() => 'Please enter a title'),
      createdIn: yup.string().defined(),
      annotation: yup
        .string()
        .notOneOf(['<p></p>'], () => 'Please enter a description')
        .defined(),
      walletAddress: yup.string().address().required(),
    })
    .defined();

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      createdIn: 0,
      title: '',
      annotation: '<p></p>',
      walletAddress,
      decisionMethod: 'reputation',
    },
    actionType: ActionTypes.MOTION_CREATE_DECISION,
  });
};
