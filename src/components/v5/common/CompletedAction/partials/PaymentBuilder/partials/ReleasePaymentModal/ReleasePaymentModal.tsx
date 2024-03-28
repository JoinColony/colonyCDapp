import { Wallet } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { ActionTypes } from '~redux';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { formatText } from '~utils/intl.ts';
import { type SelectOption } from '~v5/common/Fields/Select/types.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/index.ts';

import {
  useGetReleaseDecisionMethodItems,
  releaseDecisionMethodDescriptions,
} from './hooks.ts';
import { type ReleasePaymentModalProps } from './types.ts';

const ReleasePaymentModal: FC<ReleasePaymentModalProps> = ({
  expenditure,
  isOpen,
  onClose,
  ...rest
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const [method, setMethod] = useState<SelectOption['value']>();
  const releaseDecisionMethodItems =
    useGetReleaseDecisionMethodItems(expenditure);

  const finalizePayload: FinalizeExpenditurePayload = {
    colonyAddress: colony.colonyAddress,
    expenditure,
    userAddress: user?.walletAddress ?? '',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} icon={Wallet} {...rest}>
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
        <div className="flex w-full justify-center">
          <ActionButton
            actionType={ActionTypes.EXPENDITURE_FINALIZE}
            values={finalizePayload}
            disabled={!method}
            mode="primarySolid"
            isFullSize
            onSuccess={() => {
              onClose();
            }}
          >
            {formatText({ id: 'releaseModal.accept' })}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
};

export default ReleasePaymentModal;
