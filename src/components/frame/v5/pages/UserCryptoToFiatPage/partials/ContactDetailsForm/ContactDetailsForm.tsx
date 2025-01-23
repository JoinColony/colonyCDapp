import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { CountrySelect } from './CountrySelect.tsx';
import { SubdivisionSelect } from './SubdivisionSelect.tsx';
import {
  AddressFields,
  addressValidationSchema,
  type ContactDetailsFormSchema,
} from './validation.ts';

interface ContactDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const ContactDetailsForm: FC<ContactDetailsFormProps> = ({
  onSubmit,
  onClose,
  isLoading,
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
        className="flex flex-col gap-4"
      >
        {/* <FormRow>
          <FormDatepicker
            name="birthDate"
            label={formatText(CONTACT_DETAILS_FORM_MSGS.dobLabel)}
            placeholder={formatText(CONTACT_DETAILS_FORM_MSGS.dobPlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="tax"
            label={formatText(CONTACT_DETAILS_FORM_MSGS.taxLabel)}
            placeholder={formatText(CONTACT_DETAILS_FORM_MSGS.taxPlaceholder)}
          />
        </FormRow> */}

        <FormRow>
          <CountrySelect />
        </FormRow>

        <FormRow>
          <FormInput<ContactDetailsFormSchema>
            name={AddressFields.ADDRESS1}
            label={formatText(CONTACT_DETAILS_FORM_MSGS.address1Label)}
            placeholder={formatText(
              CONTACT_DETAILS_FORM_MSGS.address1Placeholder,
            )}
          />
        </FormRow>
        <FormRow>
          <FormInput<ContactDetailsFormSchema>
            name={AddressFields.ADDRESS2}
            label={formatText(CONTACT_DETAILS_FORM_MSGS.address2Label)}
            placeholder={formatText(
              CONTACT_DETAILS_FORM_MSGS.address2Placeholder,
            )}
          />
        </FormRow>
        <FormRow>
          <div className="flex">
            <div className="mr-1 flex-1">
              <FormInput<ContactDetailsFormSchema>
                name={AddressFields.CITY}
                label={formatText(CONTACT_DETAILS_FORM_MSGS.cityLabel)}
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
            name={AddressFields.POSTCODE}
            label={formatText(CONTACT_DETAILS_FORM_MSGS.postcodeLabel)}
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
          className="mt-4"
          isLoading={isLoading}
        />
      </Form>
    </div>
  );
};

export default ContactDetailsForm;
