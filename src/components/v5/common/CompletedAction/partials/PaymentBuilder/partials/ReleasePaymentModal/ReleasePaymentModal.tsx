import React, { useState, type FC } from 'react';

import { formatText } from '~utils/intl.ts';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/index.ts';
import { type ModalProps } from '~v5/shared/Modal/types.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/index.ts';

import {
  useGetReleaseDecisionMethodItems,
  releaseDecisionMethodDescriptions,
} from './consts.ts';

const ReleasePaymentModal: FC<ModalProps> = ({ isOpen, onClose, ...rest }) => {
  const [method, setMethod] = useState<SelectOption['value']>();
  const releaseDecisionMethodItems = useGetReleaseDecisionMethodItems();

  return (
    <Modal isOpen={isOpen} onClose={onClose} {...rest}>
      <h5 className="mb-2 heading-5">
        {formatText({ id: 'releaseModal.title' })}
      </h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText({ id: 'releaseModal.description' })}
      </p>
      <div className="mb-8">
        <DecisionMethodSelect
          options={releaseDecisionMethodItems}
          value={method}
          onChange={(newValue) =>
            setMethod(newValue ? newValue.value : undefined)
          }
        />
        {method && (
          <div className="mt-4 rounded border border-warning-200 bg-warning-100 px-6 py-3">
            <p className="text-sm text-gray-900">
              {releaseDecisionMethodDescriptions[method]}
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
        <Button mode="primaryOutline" isFullSize onClick={onClose}>
          {formatText({ id: 'button.cancel' })}
        </Button>
        <Button
          mode="primarySolid"
          isFullSize
          onClick={() => {
            onClose();
          }}
        >
          {formatText({ id: 'releaseModal.accept' })}
        </Button>
      </div>
    </Modal>
  );
};

export default ReleasePaymentModal;
