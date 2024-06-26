import * as Yup from 'yup';

export const getValidationSchema = (shouldValidateAddress) =>
  Yup.object({
    date: Yup.string().required(),
    tax: Yup.string().required(),
    address1: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    address2: Yup.string().notRequired(),
    city: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    subdivisions: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
    postcode: shouldValidateAddress
      ? Yup.string().required()
      : Yup.string().notRequired(),
  }).defined();
