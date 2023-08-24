import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { toFinite } from '~utils/lodash';
import { getMintTokenDialogPayload } from '~common/Dialogs/MintTokenDialog/helpers';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { useActionHook } from '../ActionForm/hooks';

export const useMintToken = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  const transform = pipe(
    mapPayload((payload) => {
      const values = {
        mintAmount: payload.amount,
        motionDomainId: payload.createdIn,
        decisionMethod: payload.decisionMethod,
        annotation: payload.annotation,
      };
      if (colony) {
        return getMintTokenDialogPayload(colony, values);
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
      decisionMethod: yup.string().defined(),
      annotation: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
    })
    .defined();

  return useActionHook({
    validationSchema,
    transform,
    defaultValues: {
      forceAction: false,
      annotation: '',
      amount: 0,
    },
    actionType: ActionTypes.ACTION_MINT_TOKENS,
  });
};
