import React, { type FC } from 'react';

import { CURRENCIES } from '~frame/v5/pages/UserCryptoToFiatPage/constants.ts';
import { type BankDetailsFormValues } from '~frame/v5/pages/UserCryptoToFiatPage/types.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';

import { FormRow } from '../FormRow.tsx';
import ModalFormCTAButtons from '../ModalFormCTAButtons/ModalFormCTAButtons.tsx';
import ModalHeading from '../ModalHeading/ModalHeading.tsx';

import { AccountDetailsInputs } from './AccountDetailsInputs.tsx';
import { BANK_DETAILS_FORM_MSG } from './constants.ts';
import { CurrencyFormattedOptionLabel } from './CurrencyFormattedOptionLabel.tsx';
import {
  BankDetailsFields,
  type BankDetailsFormSchema,
  validationSchema,
} from './validation.ts';

interface BankDetailsFormProps {
  onSubmit: (values: any) => void;
  onClose: () => void;
  defaultValues: BankDetailsFormValues;
  isLoading?: boolean;
}

const BankDetailsForm: FC<BankDetailsFormProps> = ({
  onSubmit,
  onClose,
  defaultValues,
  isLoading,
}) => {
  return (
    <div>
      <ModalHeading
        title={BANK_DETAILS_FORM_MSG.title}
        subtitle={BANK_DETAILS_FORM_MSG.subtitle}
      />
      <Form
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
        validationSchema={validationSchema}
        mode="onSubmit"
        defaultValues={defaultValues}
      >
        <FormRow>
          <FormInput<BankDetailsFormSchema>
            name={BankDetailsFields.ACCOUNT_OWNER}
            shouldFocus
            label={formatText(BANK_DETAILS_FORM_MSG.accountOwnerNameLabel)}
            placeholder={formatText(
              BANK_DETAILS_FORM_MSG.accountOwnerNamePlaceholder,
            )}
          />
        </FormRow>
        <FormRow>
          <FormInput<BankDetailsFormSchema>
            name={BankDetailsFields.BANK_NAME}
            label={formatText(BANK_DETAILS_FORM_MSG.bankNameLabel)}
            placeholder={formatText(BANK_DETAILS_FORM_MSG.bankNamePlaceholder)}
          />
        </FormRow>
        <FormRow>
          <FormSelect<BankDetailsFormSchema>
            name={BankDetailsFields.CURRENCY}
            labelMessage={formatText(BANK_DETAILS_FORM_MSG.payoutCurrencyLabel)}
            options={CURRENCIES}
            formatOptionLabel={CurrencyFormattedOptionLabel}
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
          isLoading={isLoading}
        />
      </Form>
    </div>
  );
};

export default BankDetailsForm;
