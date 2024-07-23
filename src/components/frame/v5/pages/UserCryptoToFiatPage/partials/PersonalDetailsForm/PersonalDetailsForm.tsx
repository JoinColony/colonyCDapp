import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { validationSchema } from './validation.ts';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
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
    defaultMessage: 'Last name',
  },
  lastNamePlaceholder: {
    id: `${displayname}.lastNamePlaceholder`,
    defaultMessage: 'Last name',
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

const PersonalDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col"
        validationSchema={validationSchema}
        mode="onSubmit"
      >
        <FormRow>
          <FormInput
            name="firstName"
            shouldFocus
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

        {/* Don't need this here until different flow for US/non-US users is implemented */}
        {/* <FormRow>
          <FormSelect
            name="country"
            options={countriesOptions}
            labelMessage={formatText(MSG.countryLabel)}
            handleChange={onCountrySelect}
          />
        </FormRow> */}

        <ModalFormCTAButtons
          cancelButton={{ title: MSG.cancelButtonTitle, onClick: onClose }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};

export default PersonalDetailsForm;
