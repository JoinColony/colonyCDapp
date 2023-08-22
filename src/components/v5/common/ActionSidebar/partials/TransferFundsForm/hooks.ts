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
} from '~hooks';
import { toFinite } from '~utils/lodash';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';

export const useTransferFundsForm = () => {
  const { toggleActionSidebarOff } = useActionSidebarContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const actionType = isVotingReputationEnabled
    ? ActionTypes.ROOT_MOTION
    : ActionTypes.ACTION_MOVE_FUNDS;

  const transform = pipe(
    mapPayload((payload) => {
      if (colony) {
        return getTransferFundsDialogPayload(colony, payload);
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
      tokenAddress: yup.string().defined(),
      team: yup.number().required(),
      to: yup
        .number()
        .required()
        .when('fromDomainId', (fromDomainId, schema) =>
          schema.notOneOf([fromDomainId], 'Cannot move to same team pot'),
        ),
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
        amount: values.amount,
        motionDomainId: values.createdIn,
        fromDomainId: values.team,
        toDomainId: values.to,
        tokenAddress: values.tokenAddress,
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
