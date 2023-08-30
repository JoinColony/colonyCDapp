import { array, InferType, number, object, string } from 'yup';
import { toFinite } from '~utils/lodash';
import getLastIndexFromPath from '~utils/getLastIndexFromPath';
import { formatText } from '~utils/intl';
import { MAX_ANNOTATION_LENGTH } from '~constants';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    amount: object()
      .shape({
        amount: number()
          .required(() => formatText({ id: 'errors.amount' }))
          .transform((value) => toFinite(value))
          .moreThan(0, () => 'Amount must be greater than zero.'),
        tokenAddress: string().address().required(),
      })
      .required(),
    createdIn: string().defined(),
    description: string().max(MAX_ANNOTATION_LENGTH).notRequired(),
    recipient: string().address().required(),
    from: number().required(),
    decisionMethod: string().defined(),
    payments: array()
      .of(
        object()
          .shape({
            recipient: string().required(),
            amount: object()
              .shape({
                amount: number()
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
              })
              .required(),
          })
          .required(),
      )
      .required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type SimplePaymentFormValues = InferType<typeof validationSchema>;
