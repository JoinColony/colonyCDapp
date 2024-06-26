/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData } from '~utils/countries.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

interface ContactDetailsFormProps {
  onSubmit: (values: any) => void;
  selectedCountry: CountryData | null;
  onClose: () => void;
}

const displayName = 'v5.pages.UserCryptoToFiatpage.partials.ContactDetailsForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Contact details',
  },
  subtitle: {
    id: `${displayName}.subtitle`,
    defaultMessage:
      'The address details provided should match your bank account details. This information is only provided to Bridge and not stored by Colony',
  },
  cancelButtonTitle: {
    id: `${displayName}.cancelButtonTitle`,
    defaultMessage: 'Cancel',
  },
  proceedButtonTitle: {
    id: `${displayName}.proceedButtonTitle`,
    defaultMessage: 'Next',
  },
  dobLabel: {
    id: `${displayName}.dobLabel`,
    defaultMessage: 'Date of birth',
  },
  dobPlaceholder: {
    id: `${displayName}.dobPlaceholder`,
    defaultMessage: 'YYYY-MM-DD',
  },
  taxLabel: {
    id: `${displayName}.taxLabel`,
    defaultMessage:
      'Tax identification number (eg. social security number or EIN)',
  },
  taxPlaceholder: {
    id: `${displayName}.taxPlaceholder`,
    defaultMessage: 'Tax identification number',
  },
});

export const ContactDetailsForm: FC<ContactDetailsFormProps> = ({
  onSubmit,
  selectedCountry,
  onClose,
}) => {
  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />
      <Form onSubmit={onSubmit}>
        <FormRow>
          <FormInput
            name="date"
            label={formatText(MSG.dobLabel)}
            placeholder={formatText(MSG.dobPlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="tax"
            label={formatText(MSG.taxLabel)}
            placeholder={formatText(MSG.taxPlaceholder)}
          />
        </FormRow>

        {!!selectedCountry?.subdivisions?.length && (
          <>
            <label className="mb-1.5 text-md font-medium text-gray-700">
              Adress
            </label>

            <FormRow>
              <FormInput name="address1" placeholder="Address line 1" />
            </FormRow>
            <FormRow>
              <FormInput name="address2" placeholder="Address line 2" />
            </FormRow>
            <FormRow>
              <div className="flex">
                <div className="flex-1">
                  <FormInput name="city" placeholder="City" />
                </div>

                <div className="flex-1">
                  <FormSelect
                    name="subdivisions"
                    options={selectedCountry?.subdivisions.map((item) => ({
                      value: item.code,
                      label: item.name,
                    }))}
                  />
                </div>
              </div>
            </FormRow>

            <FormRow>
              <FormInput name="postcode" placeholder="Postcode" />
            </FormRow>
          </>
        )}
        <ModalFormCTAButtons
          cancelButton={{ onClick: onClose, title: MSG.cancelButtonTitle }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
        />
      </Form>
    </div>
  );
};
