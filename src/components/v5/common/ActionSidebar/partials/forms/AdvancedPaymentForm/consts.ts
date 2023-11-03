import * as yup from 'yup';
import { MAX_ANNOTATION_NUM } from '~v5/shared/RichText/consts';
import { toFinite } from '~utils/lodash';
import { ACTION_BASE_VALIDATION_SCHEMA } from '~v5/common/ActionSidebar/consts';

export const validationSchema = yup
  .object()
  .shape({
    from: yup.number().required(),
    decisionMethod: yup.string().defined(),
    createdIn: yup.string().defined(),
    description: yup.string().max(MAX_ANNOTATION_NUM).notRequired(),
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
                  .required()
                  .transform((value) => toFinite(value))
                  .moreThan(0, () => 'Amount must be greater than zero'),
                tokenAddress: yup.string().address().required(),
              })
              .required(),
            delay: yup.number().moreThan(0).required(),
          })
          .required(),
      )
      .required(),
  })
  .defined()
  .concat(ACTION_BASE_VALIDATION_SCHEMA);

export type AdvancedPaymentFormValues = yup.InferType<typeof validationSchema>;
