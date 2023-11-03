import * as yup from 'yup';
import { toFinite } from '~utils/lodash';
import getLastIndexFromPath from '~utils/getLastIndexFromPath';
import { formatText } from '~utils/intl';
import { MAX_ANNOTATION_LENGTH } from '~constants';

export const validationSchema = yup
  .object()
  .shape({
    amount: yup
      .object()
      .shape({
        amount: yup
          .number()
          .required(() => formatText({ id: 'errors.amount' }))
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero.'),
        tokenAddress: yup.string().address().required(),
      })
      .required(),
    createdIn: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    recipient: yup.string().address().required(),
    from: yup.number().required(),
    decisionMethod: yup.string().defined(),
    payments: yup
      .array()
      .of(
        yup
          .object()
          .shape({
            recipient: yup.string().required(),
            amount: yup
              .object()
              .shape({
                amount: yup
                  .number()
                  .required(() => formatText({ id: 'errors.amount' }))
                  .transform((value) => toFinite(value))
                  .moreThan(0, ({ path }) => {
                    const index = getLastIndexFromPath(path);

                    if (index === undefined) {
                      return formatText({ id: 'errors.amount' });
                    }

                    return formatText(
                      { id: 'errors.payments.amount' },
                      { paymentIndex: index + 1 },
                    );
                  }),
                tokenAddress: yup.string().address().required(),
              })
              .required(),
          })
          .required(),
      )
      .required(),
  })
  .defined();

export type SimplePaymentFormValues = yup.InferType<typeof validationSchema>;
