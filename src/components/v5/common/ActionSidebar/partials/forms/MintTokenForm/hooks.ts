import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe, withMeta } from '~utils/actions';
import { useColonyContext } from '~hooks';
import { toFinite } from '~utils/lodash';
import { getMintTokenDialogPayload } from '~common/Dialogs/MintTokenDialog/helpers';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';

const validationSchema = yup
  .object()
  .shape({
    amount: yup
      .object()
      .shape({
        amount: yup
          .number()
          .required(() => 'required field')
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero'),
        tokenAddress: yup.string().address().required(),
      })
      .required(),
    createdIn: yup.string().defined(),
    decisionMethod: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).defined(),
  })
  .defined();

export const useMintToken = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain.toString(),
        description: '',
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        amount: {
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType: ActionTypes.ACTION_MINT_TOKENS,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            mintAmount: payload.amount.amount,
            motionDomainId: payload.createdIn,
            decisionMethod: payload.decisionMethod,
            annotation: payload.description,
          };

          if (colony) {
            return getMintTokenDialogPayload(colony, values);
          }

          return null;
        }),
        withMeta({ navigate }),
      ),
      [colony, navigate],
    ),
  });
};
