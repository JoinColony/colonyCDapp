import * as Yup from 'yup';

import { formErrorMessage } from '~utils/intl.ts';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';

export const addressValidationSchema = Yup.object({
  country: Yup.string().required(
    formErrorMessage(CONTACT_DETAILS_FORM_MSGS.countryLabel, 'required'),
  ),
  address1: Yup.string().required(
    formErrorMessage(CONTACT_DETAILS_FORM_MSGS.address1Label, 'required'),
  ),
  address2: Yup.string().notRequired(),
  city: Yup.string().required(
    formErrorMessage(CONTACT_DETAILS_FORM_MSGS.cityLabel, 'required'),
  ),
  state: Yup.string().required(
    formErrorMessage(CONTACT_DETAILS_FORM_MSGS.stateLabel, 'required'),
  ),
  postcode: Yup.string().required(
    formErrorMessage(CONTACT_DETAILS_FORM_MSGS.postcodeLabel, 'required'),
  ),
}).defined();

export type ContactDetailsFormSchema = Yup.InferType<
  typeof addressValidationSchema
>;
