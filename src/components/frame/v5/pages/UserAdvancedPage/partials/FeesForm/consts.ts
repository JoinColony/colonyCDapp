import { bool, type InferType, object } from 'yup';

export const METATRANSACTIONS_VALIDATION_SCHEMA = object({
  metatransactionsEnabled: bool<boolean>(),
}).defined();

export type MetatransactionsFormValues = InferType<
  typeof METATRANSACTIONS_VALIDATION_SCHEMA
>;
