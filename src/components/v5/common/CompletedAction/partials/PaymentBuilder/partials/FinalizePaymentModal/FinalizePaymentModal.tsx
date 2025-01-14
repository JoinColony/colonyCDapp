import { Id } from '@colony/colony-js';
import { SpinnerGap, Wallet } from '@phosphor-icons/react';
import React, { type FC } from 'react';

import { getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type FinalizeExpenditurePayload } from '~redux/sagas/expenditures/finalizeExpenditure.ts';
import { type ReclaimExpenditureStakePayload } from '~redux/sagas/expenditures/reclaimExpenditureStake.ts';
import { type FinalizeExpenditureMotionPayload } from '~redux/sagas/motions/expenditures/finalizeExpenditureMotion.ts';
import { Form } from '~shared/Fields/index.ts';
import { getAllUserRoles } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';

import {
  getFinalizeDecisionMethodDescriptions,
  validationSchema,
} from './consts.ts';
import { useGetFinalizeDecisionMethodItems } from './hooks.ts';
import { type FinalizePaymentModalProps } from './types.ts';

const FinalizePaymentModal: FC<FinalizePaymentModalProps> = ({
  expenditure,
  isOpen,
  onClose,
  onSuccess,
  ...rest
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();

  const colonyRoles = extractColonyRoles(colony.roles);
  const userPermissions = getAllUserRoles(colonyRoles, user?.walletAddress);
  const userRole = getRole(userPermissions);

  const finalizeDecisionMethodItems = useGetFinalizeDecisionMethodItems(
    expenditure,
    userRole,
  );

  const noDecisionMethodAvailable = finalizeDecisionMethodItems.every(
    ({ isDisabled }) => isDisabled,
  );

  const finalizeDecisionMethodDescriptions =
    getFinalizeDecisionMethodDescriptions(userRole.name);

  const finalizeExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_FINALIZE,
    error: ActionTypes.MOTION_EXPENDITURE_FINALIZE_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_FINALIZE_SUCCESS,
  });

  const finalizeExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_FINALIZE,
    error: ActionTypes.EXPENDITURE_FINALIZE_ERROR,
    success: ActionTypes.EXPENDITURE_FINALIZE_SUCCESS,
  });

  const reclaimExpenditureStake = useAsyncFunction({
    submit: ActionTypes.RECLAIM_EXPENDITURE_STAKE,
    error: ActionTypes.RECLAIM_EXPENDITURE_STAKE_ERROR,
    success: ActionTypes.RECLAIM_EXPENDITURE_STAKE_SUCCESS,
  });

  const { votingReputationAddress } = useEnabledExtensions();

  const handleFinalizeExpenditure = async ({ decisionMethod }) => {
    try {
      if (!expenditure) {
        return;
      }

      const finalizePayload: FinalizeExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        userAddress: user?.walletAddress ?? '',
      };

      const motionFinalizepayload: FinalizeExpenditureMotionPayload = {
        colony,
        expenditure,
        votingReputationAddress: votingReputationAddress || '',
        motionDomainId: Id.RootDomain,
      };

      if (
        decisionMethod &&
        decisionMethod.value === DecisionMethod.Reputation
      ) {
        await finalizeExpenditureViaMotion(motionFinalizepayload);
      } else {
        await finalizeExpenditure(finalizePayload);
      }

      if (expenditure.isStaked) {
        const payload: ReclaimExpenditureStakePayload = {
          colonyAddress: colony.colonyAddress,
          nativeExpenditureId: expenditure.nativeId,
        };

        await reclaimExpenditureStake(payload);
      }

      onSuccess(decisionMethod);
      onClose();
    } catch (err) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      shouldShowHeader
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
                {formatText({ id: 'finalizeModal.title' })}
              </h5>
              <p className="mb-6 text-md text-gray-600">
                {formatText({ id: 'finalizeModal.description' })}
              </p>
              <div className="mb-8">
                <DecisionMethodSelect
                  options={finalizeDecisionMethodItems}
                  name="decisionMethod"
                />
                {method && method.value && (
                  <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {formatText({ id: 'fundingModal.note' })}
                      </span>
                      {finalizeDecisionMethodDescriptions[method.value]}
                    </p>
                  </div>
                )}
                {noDecisionMethodAvailable && (
                  <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
                    {formatText({
                      id: 'finalizeModal.noDecisionMethodAvailable',
                    })}
                  </div>
                )}
              </div>
              <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                <Button mode="primaryOutline" isFullSize onClick={onClose}>
                  {formatText({ id: 'button.cancel' })}
                </Button>
                <div className="flex w-full justify-center">
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
                    <Button type="submit" mode="primarySolid" isFullSize>
                      {formatText({ id: 'finalizeModal.accept' })}
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

export default FinalizePaymentModal;
