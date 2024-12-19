import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';

import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { PERSONAL_DETAILS_FORM_MSGS } from './constants.ts';
import { validationSchema } from './validation.ts';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const PersonalDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <div>
      <ModalHeading
        title={PERSONAL_DETAILS_FORM_MSGS.title}
        subtitle={PERSONAL_DETAILS_FORM_MSGS.subtitle}
      />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
        validationSchema={validationSchema}
        mode="onSubmit"
      >
        <FormRow>
          <FormInput
            name="firstName"
            shouldFocus
            label={formatText(PERSONAL_DETAILS_FORM_MSGS.firstNameLabel)}
            placeholder={formatText(
              PERSONAL_DETAILS_FORM_MSGS.firstNamePlaceholder,
            )}
          />
        </FormRow>

        <FormRow>
          <FormInput
            name="lastName"
            label={formatText(PERSONAL_DETAILS_FORM_MSGS.lastNameLabel)}
            placeholder={formatText(
              PERSONAL_DETAILS_FORM_MSGS.lastNamePlaceholder,
            )}
          />
        </FormRow>

        <FormRow>
          <FormInput
            name="email"
            label={formatText(PERSONAL_DETAILS_FORM_MSGS.emailLabel)}
            placeholder={formatText(
              PERSONAL_DETAILS_FORM_MSGS.emailPlaceholder,
            )}
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
          cancelButton={{
            title: PERSONAL_DETAILS_FORM_MSGS.cancelButtonTitle,
            onClick: onClose,
          }}
          proceedButton={{
            title: PERSONAL_DETAILS_FORM_MSGS.proceedButtonTitle,
          }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};

export default PersonalDetailsForm;
