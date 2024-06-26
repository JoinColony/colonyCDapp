/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { getCountries } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { validationSchema } from './validation.ts';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  setSelectedCountry: (value: any) => void;
}

const displayname =
  'v5.pages.UserCryptoToFiatPage.partials.PersonalDetailsForm';

const MSG = defineMessages({
  title: {
    id: `${displayname}.title`,
    defaultMessage: 'Personal details',
  },
  subtitle: {
    id: `${displayname}.subtitle`,
    defaultMessage:
      'The information is only provided to Bridge and not stored by Colony.',
  },
  cancelButtonTitle: {
    id: `${displayname}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayname}.proceedButtonTitle`,
    defaultMessage: `Next`,
  },
  firstNameLabel: {
    id: `${displayname}.firstNameLabel`,
    defaultMessage: 'First name',
  },
  firstNamePlaceholder: {
    id: `${displayname}.firstNamePlaceholder`,
    defaultMessage: 'First name',
  },
  lastNameLabel: {
    id: `${displayname}.lastNameLabel`,
    defaultMessage: 'First name',
  },
  lastNamePlaceholder: {
    id: `${displayname}.lastNamePlaceholder`,
    defaultMessage: 'First name',
  },
  emailLabel: {
    id: `${displayname}.emailLabel`,
    defaultMessage: 'Email address',
  },
  emailPlaceholder: {
    id: `${displayname}.emailPlaceholder`,
    defaultMessage: 'Email address',
  },
  countryLabel: {
    id: `${displayname}.countryLabel`,
    defaultMessage: 'Country',
  },
  postcodePlaceholder: {
    id: `${displayname}.postcodePlaceholder`,
    defaultMessage: 'Postcode',
  },
});

export const PersonalDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  setSelectedCountry,
  onClose,
}) => {
  const countries = getCountries();
  const countriesOptions = countries.map((item) => ({
    value: item.alpha3,
    label: item.name,
    country: item,
  }));

  const onCountrySelect = (item) => {
    setSelectedCountry(item?.country);
  };

  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 "
        validationSchema={validationSchema}
        mode="onSubmit"
      >
        <FormRow>
          <FormInput
            name="firstName"
            label={formatText(MSG.firstNameLabel)}
            placeholder={formatText(MSG.firstNamePlaceholder)}
          />
        </FormRow>

        <FormRow>
          <FormInput
            name="lastName"
            label={formatText(MSG.lastNameLabel)}
            placeholder={formatText(MSG.lastNamePlaceholder)}
          />
        </FormRow>

        <FormRow>
          <FormInput
            name="email"
            label={formatText(MSG.emailLabel)}
            placeholder={formatText(MSG.emailPlaceholder)}
          />
        </FormRow>

        <FormRow>
          <FormSelect
            name="country"
            options={countriesOptions}
            labelMessage={formatText(MSG.countryLabel)}
            handleChange={onCountrySelect}
          />
        </FormRow>

        <ModalFormCTAButtons
          cancelButton={{ title: MSG.cancelButtonTitle, onClick: onClose }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};
