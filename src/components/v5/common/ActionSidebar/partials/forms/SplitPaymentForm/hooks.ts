import * as yup from 'yup';
import { useCallback, useMemo } from 'react';
import { Id } from '@colony/colony-js';
import { useWatch } from 'react-hook-form';
import { ActionTypes } from '~redux';
import { mapPayload, pipe } from '~utils/actions';
import { useColonyContext, useNetworkInverseFee } from '~hooks';
import { getCreatePaymentDialogPayload } from '~common/Dialogs/CreatePaymentDialog/helpers';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { ActionFormBaseProps } from '../../../types';
import { useActionFormBaseHook } from '../../../hooks';
import { DECISION_METHOD_OPTIONS } from '../../consts';
import { notNull } from '~utils/arrays';

const validationSchema = yup
  .object({
    amount: yup
      .object({
        amount: yup
          .number()
          .required(() => 'required field')
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero'),
        tokenAddress: yup.string().address().required(),
      })
      .required(),
    createdIn: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
    team: yup.string().required(),
    decisionMethod: yup.string().defined(),
    distributionMethod: yup.string().defined(),
    payments: yup
      .array(
        yup.object().shape({
          percent: yup.number().required(),
          recipient: yup.string().required(),
        }),
      )
      .test('sum', 'The sum of percentages must be 100', (value) => {
        if (!value) {
          return false;
        }

        const sum = value.reduce((acc, curr) => acc + (curr?.percent || 0), 0);

        return sum === 100;
      })
      .required(),
  })
  .defined();

export const useSplitPayment = (
  getFormOptions: ActionFormBaseProps['getFormOptions'],
) => {
  const { networkInverseFee } = useNetworkInverseFee();
  const { colony } = useColonyContext();
  const colonyTokens = useMemo(
    () =>
      colony?.tokens?.items
        .filter(notNull)
        .map((colonyToken) => colonyToken.token) || [],
    [colony?.tokens?.items],
  );
  const amount = useWatch({ name: 'amount' });
  const currentToken = useMemo(
    () =>
      colonyTokens.find(
        (token) => token?.tokenAddress === amount?.tokenAddress,
      ),
    [amount?.tokenAddress, colonyTokens],
  );
  const distributionMethod = useWatch({ name: 'distributionMethod' });

  useActionFormBaseHook({
    validationSchema,
    defaultValues: useMemo(
      () => ({
        amount: {
          amount: 0,
          tokenAddress: colony?.nativeToken.tokenAddress || '',
        },
        createdIn: Id.RootDomain.toString(),
        decisionMethod: DECISION_METHOD_OPTIONS[0]?.value,
        payments: [
          {
            percent: 0,
          },
        ],
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

  return {
    currentToken,
    amount: Number(amount?.amount || 0),
    distributionMethod,
  };
};
