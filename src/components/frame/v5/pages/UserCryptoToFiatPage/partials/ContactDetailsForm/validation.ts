import * as Yup from 'yup';

import { COUNTRIES_WITHOUT_STATES } from '~utils/countries.ts';

export const addressValidationSchema = Yup.object({
  country: Yup.string().required(),
  address1: Yup.string().required(),
  address2: Yup.string().notRequired(),
  city: Yup.string().required(),
  state: Yup.string().when('country', {
    is: (country) => COUNTRIES_WITHOUT_STATES.includes(country),
    then: Yup.string().notRequired(),
    otherwise: Yup.string().required(),
  }),
  postcode: Yup.string().required(),
}).defined();
