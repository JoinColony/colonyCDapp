import { InferType, boolean, number, object, string } from 'yup';

import { MAX_ANNOTATION_LENGTH } from '~constants';

const amountValidation = number().required().moreThan(0);

export const defaultValidationSchema = object()
  .shape({
    domainId: number().required(),
    user: object().shape({
      walletAddress: string().address().required(),
    }),
    amount: amountValidation,
    annotation: string().max(MAX_ANNOTATION_LENGTH),
    forceAction: boolean().defined(),
    motionDomainId: number().defined(),
  })
  .defined();

export const getAmountValidationSchema = (schemaUserReputation: number) =>
  object()
    .shape({
      amount: amountValidation.max(schemaUserReputation),
    })
    .required();

export type FormValues = InferType<typeof defaultValidationSchema>;
