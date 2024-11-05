import { CodeBlock } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  type AddTransactionFormModalProps,
  type AddTransactionTableModel,
} from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import { FormSelect } from '~v5/common/Fields/Select/FormSelect.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

const displayName =
  'v5.common.ActionSidebar.partials.ArbitraryTxsForm.partials.AddTransactionModal';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Contract interaction',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'Provide the contract address you want to interact with it. We will try to generate the ABI if found, otherwise, you can enter it in manually. Then select the action you want to take.',
  },
  link: {
    id: `${displayName}.link`,
    defaultMessage: 'Learn more about contract interactions',
  },
  contractAddressField: {
    id: `${displayName}.contractAddressField`,
    defaultMessage: 'Target contract address',
  },
  contractAddressPlaceholder: {
    id: `${displayName}.contractAddressPlaceholder`,
    defaultMessage: 'Enter contract address',
  },
  abiJsonField: {
    id: `${displayName}.abiJsonField`,
    defaultMessage: 'ABI/JSON',
  },
  methodField: {
    id: `${displayName}.methodField`,
    defaultMessage: 'Select a method to interact with',
  },
  methodPlaceholder: {
    id: `${displayName}.methodPlaceholder`,
    defaultMessage: 'Select method',
  },
  toField: {
    id: `${displayName}.toField`,
    defaultMessage: '_to (address)',
  },
  toPlaceholder: {
    id: `${displayName}.toPlaceholder`,
    defaultMessage: 'Enter value',
  },
  amountField: {
    id: `${displayName}.amountField`,
    defaultMessage: '_amount (uint256)',
  },
  amountPlaceholder: {
    id: `${displayName}.amountPlaceholder`,
    defaultMessage: 'Enter value',
  },
  submitButton: {
    id: `${displayName}.submitButton`,
    defaultMessage: 'Confirm',
  },
});

const AddTransactionModal: FC<AddTransactionFormModalProps> = ({
  onSubmit,
  ...rest
}) => {
  const { onClose } = rest;

  const methodOptions = [
    {
      value: 'mint',
      label: 'mint',
    },
    {
      value: 'mint2',
      label: 'mint2',
    },
  ];

  return (
    <Modal buttonMode="primarySolid" icon={CodeBlock} isFullOnMobile {...rest}>
      <Form<AddTransactionTableModel> onSubmit={onSubmit}>
        {() => (
          <>
            <h5 className="mb-1.5 heading-5">{formatText(MSG.title)}</h5>
            <p className="mb-10 text-md text-gray-600 md:mb-6">
              {formatText(MSG.description)}
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="mb-4 text-sm text-blue-400 underline">
              {formatText(MSG.link)}
            </a>
            <FormInputBase
              wrapperClassName="mt-6"
              name="contract"
              label={formatText(MSG.contractAddressField)}
              placeholder={formatText(MSG.contractAddressPlaceholder)}
            />
            <div className="mt-6">
              {formatText(MSG.abiJsonField)}
              <FormTextareaBase
                name="json"
                id="json"
                className="min-h-[7rem] rounded border border-gray-300 bg-base-white px-3.5 py-2 focus:border-blue-200 focus:shadow-light-blue"
              />
            </div>
            <FormSelect
              name="method"
              labelMessage={formatText(MSG.methodField)}
              placeholder={formatText(MSG.methodPlaceholder)}
              options={methodOptions}
            />
            <FormInputBase
              wrapperClassName="mt-6"
              name="to"
              label={formatText(MSG.toField)}
              placeholder={formatText(MSG.toPlaceholder)}
            />
            <FormInputBase
              wrapperClassName="mt-6"
              name="amount"
              label={formatText(MSG.amountField)}
              placeholder={formatText(MSG.amountPlaceholder)}
            />
            <div className="mt-[5.625rem] flex flex-col-reverse gap-3 sm:flex-row md:mt-8">
              <Button
                type="button"
                mode="primaryOutline"
                isFullSize
                onClick={() => onClose()}
              >
                {formatText({ id: 'button.cancel' })}
              </Button>
              <Button mode="primarySolid" isFullSize type="submit">
                {formatText(MSG.submitButton)}
              </Button>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

AddTransactionModal.displayName = displayName;

export default AddTransactionModal;
