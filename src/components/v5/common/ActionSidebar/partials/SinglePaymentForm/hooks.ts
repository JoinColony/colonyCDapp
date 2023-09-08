import * as yup from 'yup';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { useActionHook } from '../ActionForm/hooks';

export const useSinglePayment = () => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();

  const validationSchema = yup
    .object()
    .shape({
      amount: yup
        .number()
        .required(() => 'required field')
        .transform((value) => toFinite(value))
        .moreThan(0, () => 'Amount must be greater than zero'),
      createdIn: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
      tokenAddress: yup.string().address().required(),
      recipient: yup.string().required(),
      team: yup.number().required(),
      decisionMethod: yup.string().defined(),
      payments: yup.array().of(
        yup.object().shape({
          recipent: yup.string(),
          amount: yup.string(),
        }),
      ),
    })
    .defined();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        amount: payload.amount,
        tokenAddress: payload.tokenAddress,
        fromDomainId: payload.team,
        recipient: { walletAddress: payload.recipient },
        motionDomainId: payload.createdIn,
        annotation: payload.annotation,
        decisionMethod: payload.decisionMethod,
        payments: payload.payments,
      };
      if (colony) {
        return getCreatePaymentDialogPayload(colony, values, networkInverseFee);
      }
      return null;
    }),
  );

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      tokenAddress: colony?.nativeToken.tokenAddress || '',
      team: 1,
      to: 1,
      recipent: undefined,
      forceAction: false,
      decisionMethod: 'reputation',
      annotation: '',
      amount: 0,
      payments: [],
    },
    defaultAction: ActionTypes.MOTION_EXPENDITURE_PAYMENT,
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
  });
};
