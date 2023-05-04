import { InferType, boolean, number, object, string } from 'yup';

const amountValidation = number().required().moreThan(0);

export const defaultValidationSchema = object()
  .shape({
    domainId: number().required(),
    user: object().shape({
      walletAddress: string().address().required(),
    }),
    amount: amountValidation,
    annotation: string().max(4000),
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
