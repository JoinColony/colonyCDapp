import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ActionTypes } from '~redux';
import { getFormAction, mapPayload, pipe } from '~utils/actions';
import {
  useAsyncFunction,
  useColonyContext,
  useEnabledExtensions,
  useNetworkInverseFee,
} from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { useActionSidebarContext } from '~context/ActionSidebarContext';

export const useSinglePayment = () => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();

  const actionType = isVotingReputationEnabled
    ? ActionTypes.MOTION_EXPENDITURE_PAYMENT
    : ActionTypes.ACTION_EXPENDITURE_PAYMENT;

  const transform = pipe(
    mapPayload((payload) => {
      if (colony) {
        return getCreatePaymentDialogPayload(
          colony,
          payload,
          networkInverseFee,
        );
      }
      return null;
    }),
  );

  const asyncFunction = useAsyncFunction({
    submit: actionType,
    error: getFormAction(actionType, 'ERROR'),
    success: getFormAction(actionType, 'SUCCESS'),
    transform,
  });

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
    })
    .defined();

  type FormValues = yup.InferType<typeof validationSchema>;

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await asyncFunction({
        amount: values.amount,
        tokenAddress: values.tokenAddress,
        fromDomainId: values.team,
        recipient: { walletAddress: values.recipient },
        motionDomainId: values.createdIn,
        annotation: values.annotation,
        decisionMethod: values.decisionMethod,
      });
      toggleActionSidebarOff();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    methods,
    onSubmit,
  };
};
