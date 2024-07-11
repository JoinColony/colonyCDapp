/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useMemo, useState, type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { type CountryData } from '~utils/countries.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { CountrySelect } from './CountrySelect.tsx';
import { getValidationSchema } from './validation.ts';

interface ContactDetailsFormProps {
  onSubmit: (values: any) => void;
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
    defaultMessage: 'Submit',
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
  onClose,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null,
  );
  const validationSchema = useMemo(() => {
    // For the US country, validation should include address validation.
    const shouldValiateAddress = selectedCountry?.alpha2 === 'US';
    return getValidationSchema(shouldValiateAddress);
  }, [selectedCountry]);

  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />

      <Form
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        mode="onSubmit"
      >
        {/* <FormRow>
          <FormDatepicker
            name="birthDate"
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
        </FormRow> */}

        <label className="mb-1.5 text-md font-medium text-gray-700">
          Adress
        </label>

        <FormRow>
          <CountrySelect setSelectedCountry={setSelectedCountry} />
        </FormRow>

        <FormRow>
          <FormInput name="address1" placeholder="Address line 1" />
        </FormRow>
        <FormRow>
          <FormInput name="address2" placeholder="Address line 2" />
        </FormRow>
        <FormRow>
          <div className="flex">
            <div className="mr-1 flex-1">
              <FormInput name="city" placeholder="City" />
            </div>

            {!!selectedCountry?.subdivisions?.length && (
              <div className="ml-1 flex-1">
                <FormSelect
                  name="state"
                  options={selectedCountry?.subdivisions.map((item) => ({
                    value: item.code,
                    label: item.name,
                  }))}
                />
              </div>
            )}
          </div>
        </FormRow>

        <FormRow>
          <FormInput name="postcode" placeholder="Postcode" />
        </FormRow>

        <ModalFormCTAButtons
          cancelButton={{ onClick: onClose, title: MSG.cancelButtonTitle }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
        />
      </Form>
    </div>
  );
};
