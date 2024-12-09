import { Id } from '@colony/colony-js';
import {
  CheckCircle,
  Prohibit,
  SpinnerGap,
  WarningCircle,
} from '@phosphor-icons/react';
import React, { useState, type FC } from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import useExpenditureStaking from '~hooks/useExpenditureStaking.ts';
import { ActionTypes } from '~redux';
import { type ReclaimExpenditureStakePayload } from '~redux/sagas/expenditures/reclaimExpenditureStake.ts';
import {
  type CancelStakedExpenditurePayload,
  type CancelExpenditurePayload,
} from '~redux/types/actions/expenditures.ts';
import {
  type StakedExpenditureCancelMotionPayload,
  type ExpenditureCancelMotionPayload,
} from '~redux/types/actions/motion.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { Form } from '~shared/Fields/index.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button, { ActionButton } from '~v5/shared/Button/index.ts';
import { LoadingBehavior } from '~v5/shared/Button/types.ts';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';
import AmountField from '../PaymentBuilderTable/partials/AmountField/AmountField.tsx';
import { ExpenditureStep } from '../PaymentBuilderWidget/types.ts';

import {
  cancelDecisionMethodDescriptions,
  stakedValidationSchema,
  validationSchema,
} from './consts.ts';
import { useCancelingDecisionMethods } from './hooks.ts';
import RadioButtons from './partials/RadioButtons.tsx';
import { PenaliseOptions } from './partials/types.ts';
import { type CancelModalProps } from './types.ts';

const CancelModal: FC<CancelModalProps> = ({
  isOpen,
  onClose,
  refetchExpenditure,
  isActionStaked,
  expenditure,
  ...rest
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { setExpectedStepKey } = usePaymentBuilderContext();
  const { votingReputationAddress } = useEnabledExtensions();
  const { nativeToken } = colony;
  const { tokenAddress } = nativeToken;

  const payload: CancelExpenditurePayload = {
    colonyAddress: colony.colonyAddress,
    expenditure,
    userAddress: user?.walletAddress ?? '',
  };
  const motionPayload: ExpenditureCancelMotionPayload = {
    colony,
    expenditure,
    userAddress: user?.walletAddress ?? '',
    motionDomainId: Id.RootDomain,
    votingReputationAddress: votingReputationAddress ?? '',
  };

  const {
    stakeAmount = '0',
    isLoading,
    stakedExpenditureAddress = '',
  } = useExpenditureStaking();

  const cancelExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_CANCEL,
    error: ActionTypes.EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.EXPENDITURE_CANCEL_SUCCESS,
  });
  const cancelExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_CANCEL,
    error: ActionTypes.MOTION_EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_CANCEL_SUCCESS,
  });
  const cancelStakedExpenditure = useAsyncFunction({
    submit: ActionTypes.STAKED_EXPENDITURE_CANCEL,
    error: ActionTypes.STAKED_EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.STAKED_EXPENDITURE_CANCEL_SUCCESS,
  });
  const cancelStakedExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL,
    error: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_ERROR,
    success: ActionTypes.MOTION_STAKED_EXPENDITURE_CANCEL_SUCCESS,
  });
  const reclaimExpenditureStake = useAsyncFunction({
    submit: ActionTypes.RECLAIM_EXPENDITURE_STAKE,
    error: ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR,
    success: ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
  });

  const handleFundExpenditure = async ({ decisionMethod, penalise }) => {
    setIsSubmitting(true);
    try {
      if (!expenditure) {
        return;
      }

      const stakedPayload: CancelStakedExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        stakedExpenditureAddress,
        shouldPunish: penalise === PenaliseOptions.Yes,
      };
      const stakedMotionPayload: StakedExpenditureCancelMotionPayload = {
        colonyAddress: colony.colonyAddress,
        colonyName: colony.name,
        expenditure,
        motionDomainId: Id.RootDomain,
        stakedExpenditureAddress,
        shouldPunish: penalise === PenaliseOptions.Yes,
      };
      const reclaimPayload: ReclaimExpenditureStakePayload = {
        colonyAddress: colony.colonyAddress,
        nativeExpenditureId: expenditure.nativeId,
      };

      if (
        decisionMethod &&
        decisionMethod.value === DecisionMethod.Reputation
      ) {
        if (penalise) {
          await cancelStakedExpenditureViaMotion(stakedMotionPayload);
        } else {
          await cancelExpenditureViaMotion(motionPayload);
        }
      } else if (penalise) {
        await cancelStakedExpenditure(stakedPayload);
        await reclaimExpenditureStake(reclaimPayload);
      } else {
        await cancelExpenditure(payload);
      }

      await refetchExpenditure({
        expenditureId: expenditure.id,
      });

      setIsSubmitting(false);
      setExpectedStepKey(
        isActionStaked ? ExpenditureStep.Reclaim : ExpenditureStep.Cancel,
      );
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      onClose();
    }
  };

  const isExpenditureLocked =
    expenditure.lockingActions?.items &&
    expenditure.lockingActions.items.length > 0;

  const cancelDecisionMethodItems = useCancelingDecisionMethods();

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
          validationSchema={
            isActionStaked ? stakedValidationSchema : validationSchema
          }
          defaultValues={{ decisionMethod: {}, penalise: '' }}
        >
          {({ watch }) => {
            const method = watch('decisionMethod');
            const penalise = watch('penalise');

            return (
              <>
                <div className="mb-8">
                  {isActionStaked && (
                    <>
                      <div className="mb-4 flex items-center justify-between rounded bg-gray-50 p-3 text-gray-900">
                        <p className="text-1">
                          {formatText({ id: 'cancelModal.creatorStake' })}
                        </p>
                        {isLoading ? (
                          <SpinnerLoader appearance={{ size: 'small' }} />
                        ) : (
                          <AmountField
                            amount={stakeAmount || '0'}
                            tokenAddress={tokenAddress}
                          />
                        )}
                      </div>
                      <h5 className="mb-4 text-gray-900 text-1">
                        {formatText({ id: 'cancelModal.penaliseTitle' })}
                      </h5>
                      <div className="mb-4">
                        <RadioButtons />
                      </div>
                      {penalise && penalise === PenaliseOptions.No && (
                        <div className="mb-4 flex gap-2 rounded-lg border border-success-200 bg-success-100 px-[1.125rem] py-3">
                          <CheckCircle
                            size={18}
                            className="shrink-0 text-success-400"
                          />
                          <p className="text-md">
                            The payment creator will keep their full stake and
                            reputation
                          </p>
                        </div>
                      )}
                      {penalise && penalise === PenaliseOptions.Yes && (
                        <div className="mb-4 flex gap-2 rounded-lg border border-negative-200 bg-negative-100 px-[1.125rem] py-3">
                          <WarningCircle
                            size={18}
                            className="shrink-0 text-negative-400"
                          />
                          <p className="text-md">
                            The payment creator will lose their full stake and
                            the relative amount of reputation. Penalised funds
                            are burned.
                          </p>
                        </div>
                      )}
                    </>
                  )}
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
