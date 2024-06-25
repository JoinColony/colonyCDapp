import { SpinnerGap, Wallet } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';

import {
  useGetReleaseDecisionMethodItems,
  releaseDecisionMethodDescriptions,
  validationSchema,
} from './hooks.ts';
import { type ReleasePaymentModalProps } from './types.ts';

const ReleasePaymentModal: FC<ReleasePaymentModalProps> = ({
  expenditure,
  isOpen,
  onClose,
  onSuccess,
  ...rest
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const releaseDecisionMethodItems =
    useGetReleaseDecisionMethodItems(expenditure);

  const finalizeExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_FINALIZE,
    error: ActionTypes.EXPENDITURE_FINALIZE_ERROR,
    success: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
  });

  const handleFinalizeExpenditure = async () => {
    try {
      if (!expenditure) {
        return;
      }

      const finalizePayload: FinalizeExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        userAddress: user?.walletAddress ?? '',
      };

      await finalizeExpenditure(finalizePayload);

      onSuccess();
      onClose();
    } catch (err) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeaderProps={{ className: 'right-6 top-[2.0625rem]' }}
      icon={Wallet}
      {...rest}
    >
      <Form
        className="flex h-full flex-col"
        onSubmit={handleFinalizeExpenditure}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        {({ watch, formState: { isSubmitting } }) => {
          const method = watch('decisionMethod');

          return (
            <>
              <h5 className="mb-2 heading-5">
                {formatText({ id: 'releaseModal.title' })}
              </h5>
              <p className="mb-6 text-md text-gray-600">
                {formatText({ id: 'releaseModal.description' })}
              </p>
              <div className="mb-8">
                <DecisionMethodSelect
                  options={releaseDecisionMethodItems}
                  name="decisionMethod"
                />
                {method && method.value && (
                  <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {formatText({ id: 'fundingModal.note' })}
                      </span>
                      {releaseDecisionMethodDescriptions[method.value]}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                <Button mode="primaryOutline" isFullSize onClick={onClose}>
                  {formatText({ id: 'button.cancel' })}
                </Button>
                <div className="flex w-full justify-center">
                  {isSubmitting ? (
                    <TxButton
                      className="max-h-[2.5rem] w-full !text-md"
                      rounded="s"
                      text={{ id: 'button.pending' }}
                      icon={
                        <span className="ml-1.5 flex shrink-0">
                          <SpinnerGap className="animate-spin" size={14} />
                        </span>
                      }
                    />
                  ) : (
                    <Button type="submit" mode="primarySolid" isFullSize>
                      {formatText({ id: 'releaseModal.accept' })}
                    </Button>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};

export default ReleasePaymentModal;
