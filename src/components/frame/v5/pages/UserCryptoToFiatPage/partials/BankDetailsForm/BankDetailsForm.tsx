import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import { CURRENCIES } from '../../constants.ts';
import { type BankDetailsFormValues } from '../../types.ts';
import { FormInput } from '../FormInput.tsx';
import { FormRow } from '../FormRow.tsx';
import { FormSelect } from '../FormSelect.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { AccountDetailsInputs } from './AccountDetailsInputs.tsx';
import { BANK_DETAILS_FORM_MSG, displayName } from './constants.ts';
import { validationSchema } from './validation.ts';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  defaultValues: BankDetailsFormValues;
}

const BankDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  onClose,
  defaultValues,
}) => {
  return (
    <div>
      <ModalHeading
        title={BANK_DETAILS_FORM_MSG.title}
        subtitle={BANK_DETAILS_FORM_MSG.subtitle}
      />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col gap-3"
        validationSchema={validationSchema}
        mode="onSubmit"
        defaultValues={defaultValues}
      >
        <FormRow>
          <FormInput
            name="accountOwner"
            shouldFocus
            label={formatText(BANK_DETAILS_FORM_MSG.accountOwnerNameLabel)}
            placeholder={formatText(
              BANK_DETAILS_FORM_MSG.accountOwnerNamePlaceholder,
            )}
          />
        </FormRow>
        <FormRow>
          <FormInput
            name="bankName"
            label={formatText(BANK_DETAILS_FORM_MSG.bankNameLabel)}
            placeholder={formatText(BANK_DETAILS_FORM_MSG.bankNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormSelect
            name="currency"
            labelMessage={formatText(BANK_DETAILS_FORM_MSG.payoutCurrencyLabel)}
            options={CURRENCIES}
            placeholder={formatText(
              BANK_DETAILS_FORM_MSG.payoutCurrencyPlaceholder,
            )}
          />
        </FormRow>

        <AccountDetailsInputs />

        <ModalFormCTAButtons
          cancelButton={{
            title: BANK_DETAILS_FORM_MSG.cancelButtonTitle,
            onClick: onClose,
          }}
          proceedButton={{ title: BANK_DETAILS_FORM_MSG.proceedButtonTitle }}
          className="mt-4"
        />
      </Form>
    </div>
  );
};

BankDetailsForm.displayName = displayName;

export default BankDetailsForm;
