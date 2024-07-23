import * as Yup from 'yup';

export const addressValidationSchema = Yup.object({
  address1: Yup.string().required(),
  address2: Yup.string().notRequired(),
  city: Yup.string().required(),
  state: Yup.string().required(),
  postcode: Yup.string().required(),
}).defined();
