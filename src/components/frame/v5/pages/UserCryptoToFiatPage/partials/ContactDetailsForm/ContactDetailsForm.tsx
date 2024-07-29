import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormInputGroup } from '../FormInputGroup.tsx';
import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { CountrySelect } from './CountrySelect.tsx';
import { SubdivisionSelect } from './SubdivisionSelect.tsx';
import { addressValidationSchema } from './validation.ts';

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
  addressLabel: {
    id: `${displayName}.addressLabel`,
    defaultMessage: 'Address',
  },
  address1Placeholder: {
    id: `${displayName}.address1Placeholder`,
    defaultMessage: 'Address line 1',
  },
  address2Placeholder: {
    id: `${displayName}.address2Placeholder`,
    defaultMessage: 'Address line 2',
  },
  cityPlaceholder: {
    id: `${displayName}.cityPlaceholder`,
    defaultMessage: 'City',
  },
  postcodePlaceholder: {
    id: `${displayName}.postcodePlaceholder`,
    defaultMessage: 'Postcode',
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

const ContactDetailsForm: FC<ContactDetailsFormProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <div>
      <ModalHeading title={MSG.title} subtitle={MSG.subtitle} />

      <Form
        onSubmit={onSubmit}
        validationSchema={addressValidationSchema}
        mode="onSubmit"
        className="flex flex-col gap-4"
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

        <FormInputGroup
          groupLabel={formatText(MSG.addressLabel)}
          groupName="address"
          names={['address1', 'address2', 'city', 'postcode']}
        >
          <FormRow>
            <CountrySelect />
          </FormRow>

          <FormRow>
            <FormInput
              name="address1"
              placeholder={formatText(MSG.address1Placeholder)}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name="address2"
              placeholder={formatText(MSG.address2Placeholder)}
            />
          </FormRow>
          <FormRow>
            <div className="flex">
              <div className="mr-1 flex-1">
                <FormInput
                  name="city"
                  placeholder={formatText(MSG.cityPlaceholder)}
                />
              </div>
              <SubdivisionSelect />
            </div>
          </FormRow>

          <FormRow>
            <FormInput
              name="postcode"
              placeholder={formatText(MSG.postcodePlaceholder)}
            />
          </FormRow>
        </FormInputGroup>

        <ModalFormCTAButtons
          cancelButton={{ onClick: onClose, title: MSG.cancelButtonTitle }}
          proceedButton={{ title: MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};

export default ContactDetailsForm;
