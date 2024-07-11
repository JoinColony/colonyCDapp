import * as Yup from 'yup';

export const getValidationSchema = (shouldValidateAddress) =>
  Yup.object({
    address1: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    address2: Yup.string().notRequired(),
    city: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    state: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    postcode: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
  }).defined();
