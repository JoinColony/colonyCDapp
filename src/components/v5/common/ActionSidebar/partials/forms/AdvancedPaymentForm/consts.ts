import { object, string, number, array, InferType } from 'yup';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = object()
  .shape({
    from: number().required(),
    decisionMethod: string().defined(),
    createdIn: string().defined(),
    description: string().max(MAX_ANNOTATION_NUM).notRequired(),
    payments: array()
      .of(
        object()
          .shape({
            recipient: string().required(),
            amount: object()
              .shape({
                amount: number()
                  .required()
                  .transform((value) => toFinite(value))
                  .moreThan(0, () => 'Amount must be greater than zero.'),
                tokenAddress: string().address().required(),
              })
              .required(),
            delay: number().moreThan(0).required(),
          })
          .required(),
      )
      .required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type AdvancedPaymentFormValues = InferType<typeof validationSchema>;
