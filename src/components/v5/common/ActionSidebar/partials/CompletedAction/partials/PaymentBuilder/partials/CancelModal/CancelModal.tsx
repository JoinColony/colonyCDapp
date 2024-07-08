import { Prohibit, SpinnerGap } from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type CancelExpenditurePayload } from '~redux/types/actions/expenditures.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button, { ActionButton } from '~v5/shared/Button/index.ts';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';
import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';

import {
  cancelDecisionMethodDescriptions,
  cancelDecisionMethodItems,
  validationSchema,
} from './consts.ts';
import { type CancelModalProps } from './types.ts';

const CancelModal: FC<CancelModalProps> = ({
  isOpen,
  onClose,
  refetchExpenditure,
  expenditure,
  ...rest
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { setExpectedStepKey } = usePaymentBuilderContext();

  const payload: CancelExpenditurePayload = {
    colonyAddress: colony.colonyAddress,
    expenditure,
    userAddress: user?.walletAddress ?? '',
  };

  const cancelExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_CANCEL,
    error: ActionTypes.EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.EXPENDITURE_CANCEL_SUCCESS,
  });

  const handleFundExpenditure = async () => {
    setIsSubmitting(true);
    try {
      if (!expenditure) {
        return;
      }

      await cancelExpenditure(payload);
      await refetchExpenditure({
        expenditureId: expenditure.id,
      });

      setIsSubmitting(false);
      setExpectedStepKey(ExpenditureStep.Cancel);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      onClose();
    }
  };

  const isExpenditureLocked =
    expenditure.lockingActions?.items &&
    expenditure.lockingActions.items.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={Prohibit}
      shouldShowHeader
      {...rest}
    >
      <h5 className="mb-2 heading-5">
        {formatText({
          id: isExpenditureLocked
            ? 'cancelModal.locked.title'
            : 'cancelModal.title',
        })}
      </h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText({
          id: isExpenditureLocked
            ? 'cancelModal.locked.description'
            : 'cancelModal.description',
        })}
      </p>
      {isExpenditureLocked ? (
        <Form
          className="flex flex-grow flex-col"
          onSubmit={handleFundExpenditure}
          validationSchema={validationSchema}
          defaultValues={{ decisionMethod: {} }}
        >
          {({ watch }) => {
            const method = watch('decisionMethod');

            return (
              <>
                <div className="mb-8">
                  <DecisionMethodSelect
                    options={cancelDecisionMethodItems}
                    name="decisionMethod"
                  />
                  {method && method.value && (
                    <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">
                          {formatText({ id: 'cancelModal.note' })}
                        </span>
                        {cancelDecisionMethodDescriptions[method.value]}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                  <Button
                    mode="primaryOutline"
                    isFullSize
                    className="w-full md:w-[calc(50%-.375rem)]"
                    onClick={onClose}
                  >
                    {formatText({ id: 'button.cancel' })}
                  </Button>
                  <div className="flex w-full justify-center md:w-[calc(50%-.375rem)]">
                    {isSubmitting ? (
                      <IconButton
                        className="w-full !text-md"
                        rounded="s"
                        text={{ id: 'button.pending' }}
                        icon={
                          <span className="ml-1.5 flex shrink-0">
                            <SpinnerGap className="animate-spin" size={18} />
                          </span>
                        }
                      />
                    ) : (
                      <Button mode="primarySolid" isFullSize type="submit">
                        {formatText({ id: 'cancelModal.submit' })}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            );
          }}
        </Form>
      ) : (
        <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <Button
            mode="primaryOutline"
            className="w-full md:w-[calc(50%-.375rem)]"
            isFullSize
            onClick={onClose}
          >
            {formatText({ id: 'button.cancel' })}
          </Button>
          <div className="flex w-full justify-center md:w-[calc(50%-.375rem)]">
            <ActionButton
              actionType={ActionTypes.EXPENDITURE_CANCEL}
              type="submit"
              mode="primarySolid"
              isFullSize
              values={payload}
              loadingBehavior={LoadingBehavior.TxLoader}
              onSuccess={() => {
                onClose();
                setExpectedStepKey(ExpenditureStep.Cancel);
                toast.success(
                  <Toast
                    type="success"
                    title={{ id: 'cancelModal.toast.title' }}
                    description={{
                      id: 'cancelModal.toast.description',
                    }}
                  />,
                );
              }}
            >
              {formatText({ id: 'cancelModal.submit' })}
            </ActionButton>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CancelModal;
