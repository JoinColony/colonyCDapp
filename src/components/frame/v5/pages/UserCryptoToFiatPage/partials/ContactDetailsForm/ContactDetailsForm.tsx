/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { CountrySelect } from './CountrySelect.tsx';
import { SubdivisionSelect } from './SubdivisionSelect.tsx';
import {
  addressValidationSchema,
  type ContactDetailsFormSchema,
} from './validation.ts';

interface ContactDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const ContactDetailsForm: FC<ContactDetailsFormProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <div>
      <ModalHeading
        title={CONTACT_DETAILS_FORM_MSGS.title}
        subtitle={CONTACT_DETAILS_FORM_MSGS.subtitle}
      />

      <Form
        onSubmit={onSubmit}
        validationSchema={addressValidationSchema}
        mode="onSubmit"
      >
        {/** @TODO Let's remove this if it's not needed anymore */}
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
          {formatText(CONTACT_DETAILS_FORM_MSGS.addressLabel)}
        </label>

        <FormRow>
          <CountrySelect />
        </FormRow>

        <FormRow>
          <FormInput<ContactDetailsFormSchema>
            name="address1"
            placeholder={formatText(
              CONTACT_DETAILS_FORM_MSGS.address1Placeholder,
            )}
          />
        </FormRow>
        <FormRow>
          <FormInput<ContactDetailsFormSchema>
            name="address2"
            placeholder={formatText(
              CONTACT_DETAILS_FORM_MSGS.address2Placeholder,
            )}
          />
        </FormRow>
        <FormRow>
          <div className="flex">
            <div className="mr-1 flex-1">
              <FormInput<ContactDetailsFormSchema>
                name="city"
                placeholder={formatText(
                  CONTACT_DETAILS_FORM_MSGS.cityPlaceholder,
                )}
              />
            </div>
            <SubdivisionSelect />
          </div>
        </FormRow>

        <FormRow>
          <FormInput<ContactDetailsFormSchema>
            name="postcode"
            placeholder={formatText(
              CONTACT_DETAILS_FORM_MSGS.postcodePlaceholder,
            )}
          />
        </FormRow>

        <ModalFormCTAButtons
          cancelButton={{
            onClick: onClose,
            title: CONTACT_DETAILS_FORM_MSGS.cancelButtonTitle,
          }}
          proceedButton={{
            title: CONTACT_DETAILS_FORM_MSGS.proceedButtonTitle,
          }}
        />
      </Form>
    </div>
  );
};

export default ContactDetailsForm;
