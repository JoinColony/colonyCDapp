import { type InferType, object, string } from 'yup';

export const validationSchema = object({
  accountOwner: string().required(),
  bankName: string().required(),
  currency: string().required(),
  country: string().when('currency', {
    is: 'eur',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  iban: string().when('currency', {
    is: 'eur',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  swift: string().when('currency', {
    is: 'eur',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  accountNumber: string().when('currency', {
    is: 'usd',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
  routingNumber: string().when('currency', {
    is: 'usd',
    then: string().required(),
    otherwise: string().notRequired(),
  }),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
