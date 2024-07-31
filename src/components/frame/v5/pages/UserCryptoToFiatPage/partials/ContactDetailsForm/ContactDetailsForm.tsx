import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { FormInput } from '../FormInput.tsx';
import { FormInputGroup } from '../FormInputGroup.tsx';
import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { CONTACT_DETAILS_FORM_MSGS } from './consts.ts';
import { CountrySelect } from './CountrySelect.tsx';
import { SubdivisionSelect } from './SubdivisionSelect.tsx';
import { AddressFields, addressValidationSchema } from './validation.ts';

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
  const handleGroupErrorMessage = (
    groupName: string,
    errorFieldNames: string[],
  ) => {
    let fields = '';
    errorFieldNames.forEach((errorFieldName, index) => {
      let delimiter = '';
      if (index < errorFieldNames.length - 2) {
        delimiter = ', ';
      }
      if (index === errorFieldNames.length - 2) {
        delimiter = ' and ';
      }
      fields +=
        formatText({ id: `cryptoToFiat.forms.address.${errorFieldName}` }) +
        delimiter;
    });

    return formatText(
      { id: `cryptoToFiat.forms.error.${groupName}` },
      { fields },
    );
  };

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

        <FormInputGroup
          groupLabel={formatText(CONTACT_DETAILS_FORM_MSGS.addressLabel)}
          groupName="address"
          names={[
            AddressFields.COUNTRY,
            AddressFields.ADDRESS1,
            AddressFields.ADDRESS2,
            AddressFields.CITY,
            AddressFields.STATE,
            AddressFields.POSTCODE,
          ]}
          getErrorMessage={handleGroupErrorMessage}
        >
          <FormRow>
            <CountrySelect />
          </FormRow>

          <FormRow>
            <FormInput
              name={AddressFields.ADDRESS1}
              shouldSkipRequiredErrorMessage
              placeholder={formatText(
                CONTACT_DETAILS_FORM_MSGS.address1Placeholder,
              )}
            />
          </FormRow>
          <FormRow>
            <FormInput
              name={AddressFields.ADDRESS2}
              shouldSkipRequiredErrorMessage
              placeholder={formatText(
                CONTACT_DETAILS_FORM_MSGS.address2Placeholder,
              )}
            />
          </FormRow>
          <FormRow>
            <div className="flex">
              <div className="mr-1 flex-1">
                <FormInput
                  name={AddressFields.CITY}
                  shouldSkipRequiredErrorMessage
                  placeholder={formatText(
                    CONTACT_DETAILS_FORM_MSGS.cityPlaceholder,
                  )}
                />
              </div>
              <SubdivisionSelect />
            </div>
          </FormRow>

          <FormRow>
            <FormInput
              name={AddressFields.POSTCODE}
              shouldSkipRequiredErrorMessage
              placeholder={formatText(
                CONTACT_DETAILS_FORM_MSGS.postcodePlaceholder,
              )}
            />
          </FormRow>
        </FormInputGroup>

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
