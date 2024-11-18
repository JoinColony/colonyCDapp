import { CodeBlock } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';

import { LEARN_MORE_ARBITRARY_TRANSACTIONS } from '~constants/externalUrls.ts';
import ExternalLink from '~shared/ExternalLink/ExternalLink.tsx';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  type AddTransactionFormModalProps,
  type AddTransactionTableModel,
} from '~v5/common/ActionSidebar/partials/forms/ArbitraryTxsForm/types.ts';
import Button from '~v5/shared/Button/index.ts';
import Modal from '~v5/shared/Modal/index.ts';

import { ContractAddressInput } from './ContractAddressInput.tsx';
import { DynamicInputs } from './DynamicInputs.tsx';
import { JsonAbiInput } from './JsonAbiInput.tsx';
import { displayName, MSG } from './translation.ts';

const AddTransactionModal: FC<AddTransactionFormModalProps> = ({
  onSubmit,
  ...rest
}) => {
  const { onClose } = rest;

  const [contractAbiLoading, setContractAbiLoading] = useState(true);

  return (
    <Modal buttonMode="primarySolid" icon={CodeBlock} {...rest}>
      <Form<AddTransactionTableModel>
        onSubmit={onSubmit}
        className="flex h-full w-full flex-grow flex-col"
      >
        {() => (
          <div className="flex h-full w-full flex-grow flex-col">
            <div className="flex-grow">
              <h5 className="mb-1.5 heading-5">{formatText(MSG.title)}</h5>
              <p className="mb-4 text-md text-gray-600">
                {formatText(MSG.description)}
              </p>
              <ExternalLink
                className="text-sm font-medium !text-blue-400 underline"
                href={LEARN_MORE_ARBITRARY_TRANSACTIONS}
                target="_blank"
              >
                {formatText(MSG.learnMoreLink)}
              </ExternalLink>
              <div className="relative mt-5 flex flex-col gap-4">
                <ContractAddressInput
                  setContractAbiLoading={setContractAbiLoading}
                  contractAbiLoading={contractAbiLoading}
                />
                <JsonAbiInput loading={contractAbiLoading} />
                <DynamicInputs />
              </div>
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
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
          </div>
        )}
      </Form>
    </Modal>
  );
};

AddTransactionModal.displayName = displayName;

export default AddTransactionModal;
