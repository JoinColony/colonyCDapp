import * as yup from 'yup';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
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
    annotation: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
    recipient: yup.string().required(),
    from: yup.number().required(),
    decisionMethod: yup.string().defined(),
  })
  .defined();

export const useSimplePayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        createdIn: Id.RootDomain.toString(),
        recipent: undefined,
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        annotation: '',
        amount: {
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
      }),
      [colony?.nativeToken.tokenAddress],
    ),
    actionType: ActionTypes.ACTION_EXPENDITURE_PAYMENT,
    getFormOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transform: useCallback(
      pipe(
        mapPayload((payload) => {
          const values = {
            amount: payload.amount.amount,
            tokenAddress: payload.amount.tokenAddress,
            fromDomainId: payload.from,
            recipient: { walletAddress: payload.recipient },
            motionDomainId: payload.createdIn,
            annotation: payload.annotation,
            decisionMethod: payload.decisionMethod,
            payments: [],
          };

          if (colony) {
            return getCreatePaymentDialogPayload(
              colony,
              values,
              networkInverseFee,
            );
          }

          return null;
        }),
      ),
      [colony, networkInverseFee],
    ),
  });
};
