import * as Yup from 'yup';

export const getValidationSchema = (selectedCountry) =>
  Yup.object({
    date: Yup.string().required(),
    tax: Yup.string().required(),
    address1: selectedCountry
      ? Yup.string().required()
      : Yup.string().notRequired(),
    address2: Yup.string().notRequired(),
    city: selectedCountry
      ? Yup.string().required()
      : Yup.string().notRequired(),
    subdivisions: selectedCountry
      ? Yup.string().required()
      : Yup.string().notRequired(),
    postcode: selectedCountry
      ? Yup.string().required()
      : Yup.string().notRequired(),
  }).defined();
