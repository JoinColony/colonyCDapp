import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { getFormAction, mapPayload, pipe, withMeta } from '~utils/actions';
import {
  useAsyncFunction,
  useColonyContext,
  useEnabledExtensions,
  useNetworkInverseFee,
} from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { getMintTokenDialogPayload } from '~common/Dialogs/MintTokenDialog/helpers';
import { MAX_ANNOTATION_LENGTH } from '~constants';

export const useSiglePayment = (toggleActionSidebarOff) => {
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
      createdIn: yup.number().defined(),
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

export const useMintToken = (toggleActionSidebarOff) => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const actionType = isVotingReputationEnabled
    ? ActionTypes.ROOT_MOTION
    : ActionTypes.ACTION_MINT_TOKENS;

  const transform = pipe(
    mapPayload((payload) => {
      if (colony) {
        return getMintTokenDialogPayload(colony, payload);
      }
      return null;
    }),
    withMeta({ navigate }),
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
      forceAction: yup.bool().defined(),
      amount: yup
        .number()
        .required(() => 'required field')
        .transform((value) => toFinite(value))
        .moreThan(0, () => 'Please enter an amount greater than 0'),
      createdIn: yup.number().defined(),
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  type FormValues = yup.InferType<typeof validationSchema>;

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      forceAction: false,
      annotation: '',
      amount: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await asyncFunction({
        mintAmount: values.amount,
        motionDomainId: values.createdIn,
        decisionMethod: values.decisionMethod,
        annotation: values.annotation,
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
