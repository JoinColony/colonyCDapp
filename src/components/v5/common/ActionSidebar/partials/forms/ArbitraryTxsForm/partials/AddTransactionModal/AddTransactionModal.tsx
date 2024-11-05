import { CodeBlock } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  type AddTransactionFormModalProps,
  type AddTransactionTableModel,
} from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import FormInput from '~v5/common/Fields/InputBase/FormInput.tsx';
import FormSelect from '~v5/common/Fields/Select/FormSelect.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { displayName, MSG } from './translation.ts';

const AddTransactionModal: FC<AddTransactionFormModalProps> = ({
  onSubmit,
  ...rest
}) => {
  const { onClose } = rest;

  // @TODO: it will be dynamic and will be updated in the next iteration
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
            <p className="mb-4 text-md text-gray-600">
              {formatText(MSG.description)}
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="#" className="mb-4 text-sm text-blue-400 underline">
              {formatText(MSG.link)}
            </a>
            <div className="mt-5 flex flex-col gap-4">
              <FormInput
                name="contract"
                label={formatText(MSG.contractAddressField)}
                placeholder={formatText(MSG.contractAddressPlaceholder)}
              />
              <FormTextareaBase
                name="json"
                label={formatText(MSG.abiJsonField)}
                id="json"
                mode="primary"
                className="min-h-[10.25rem]"
              />
              <FormSelect
                name="method"
                labelMessage={formatText(MSG.methodField)}
                placeholder={formatText(MSG.methodPlaceholder)}
                options={methodOptions}
              />
              <FormInput
                name="to"
                label={formatText(MSG.toField)}
                placeholder={formatText(MSG.toPlaceholder)}
              />
              <FormInput
                name="amount"
                label={formatText(MSG.amountField)}
                placeholder={formatText(MSG.amountPlaceholder)}
              />
            </div>
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
