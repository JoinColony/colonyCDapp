import * as Yup from 'yup';

import { postalCodesRegex } from '~constants/postalCodesRegex.ts';
import { getCountryByCode } from '~utils/countries.ts';
import { formErrorMessage } from '~utils/intl.ts';
import { capitalizeFirstLetter } from '~utils/strings.ts';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';

export enum AddressFields {
  ADDRESS1 = 'address1',
  ADDRESS2 = 'address2',
  COUNTRY = 'country',
  CITY = 'city',
  STATE = 'state',
  POSTCODE = 'postcode',
}

import { COUNTRIES_WITHOUT_STATES } from '~utils/countries.ts';

export const addressValidationSchema = Yup.object({
  [AddressFields.ADDRESS1]: Yup.string().required(),
  [AddressFields.ADDRESS2]: Yup.string().notRequired(),
  [AddressFields.COUNTRY]: Yup.string().required(),
  [AddressFields.CITY]: Yup.string().when('country', {
    is: (country) => COUNTRIES_WITHOUT_STATES.includes(country),
    then: Yup.string().notRequired(),
    otherwise: Yup.string().required(),
  }),
  [AddressFields.STATE]: Yup.string().when('country', {
    is: (country) => COUNTRIES_WITHOUT_STATES.includes(country),
    then: Yup.string().notRequired(),
    otherwise: Yup.string().required(),
  }),
  [AddressFields.POSTCODE]: Yup.string().when(
    AddressFields.COUNTRY,
    (countryCode, schema) => {
      const country = getCountryByCode(countryCode);
      const postalCodeRegex = country?.alpha2
        ? postalCodesRegex[country.alpha2]
        : null;
      if (postalCodeRegex) {
        return schema
          .required()
          .matches(
            postalCodeRegex,
            capitalizeFirstLetter(
              formErrorMessage(
                CONTACT_DETAILS_FORM_MSGS.postcodeLabel,
                'invalid',
              ),
              { lowerCaseRemainingLetters: true },
            ),
          );
      }
      return schema;
    },
  ),
}).defined();

export type ContactDetailsFormSchema = Yup.InferType<
  typeof addressValidationSchema
>;
