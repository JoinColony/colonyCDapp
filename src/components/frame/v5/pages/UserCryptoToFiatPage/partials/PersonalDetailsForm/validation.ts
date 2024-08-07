import { type InferType, object, string } from 'yup';

export const validationSchema = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().email().required(),
}).defined();

export type FormValues = InferType<typeof validationSchema>;
