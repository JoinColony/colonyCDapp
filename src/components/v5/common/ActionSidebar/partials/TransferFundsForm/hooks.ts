import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { toFinite } from '~utils/lodash';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';
import { useActionHook } from '../ActionForm/hooks';

export const useTransferFunds = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        amount: payload.amount,
        motionDomainId: payload.createdIn,
        fromDomainId: payload.team,
        toDomainId: payload.to,
        tokenAddress: payload.tokenAddress,
        decisionMethod: payload.decisionMethod,
        annotation: payload.annotation,
      };
      if (colony) {
        return getTransferFundsDialogPayload(colony, values);
      }
      return null;
    }),
    withMeta({ navigate }),
  );

  const validationSchema = yup
    .object()
    .shape({
      forceAction: yup.bool().defined(),
      amount: yup
        .number()
        .required(() => 'required field')
        .transform((value) => toFinite(value))
        .moreThan(0, () => 'Please enter an amount greater than 0'),
      createdIn: yup.string().defined(),
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

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      tokenAddress: colony?.nativeToken.tokenAddress || '',
      to: 0,
      decisionMethod: 'reputation',
      team: 0,
      annotation: '',
      amount: 0,
    },
    actionType: ActionTypes.ACTION_MOVE_FUNDS,
  });
};
