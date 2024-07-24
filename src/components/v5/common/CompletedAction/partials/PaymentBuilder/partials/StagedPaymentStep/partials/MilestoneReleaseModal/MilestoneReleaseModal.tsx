import { HandCoins, SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { Action } from '~constants/actions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type ReleaseExpenditureStagesPayload } from '~redux/sagas/expenditures/releaseExpenditureStages.ts';
import { type ReleaseExpenditureStagesMotionPayload } from '~redux/sagas/motions/expenditures/releaseExpenditureStagesMotion.ts';
import { Form } from '~shared/Fields/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import DecisionMethodSelect from '../../../DecisionMethodSelect/DecisionMethodSelect.tsx';
import MilestoneItem from '../MilestoneItem/MilestoneItem.tsx';

import {
  getValidationSchema,
  milestoneReleaseDecisionMethodDescriptions,
} from './consts.ts';
import { useMilestoneReleaseDecisionMethods } from './hooks.ts';
import {
  type MilestoneModalContentProps,
  type MilestoneReleaseModalProps,
} from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.StagedReleaseStep.partials.MilestoneReleaseModal';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Make milestone payments',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'This is a request to make the following milestone payments.',
  },
  details: {
    id: `${displayName}.details`,
    defaultMessage: 'Milestone details',
  },
  releasePayment: {
    id: `${displayName}.releasePayment`,
    defaultMessage: 'Make payment',
  },
  releaseAllPayments: {
    id: `${displayName}.releaseAllPayments`,
    defaultMessage: 'Make payments',
  },
});

const MilestoneModalContent: FC<MilestoneModalContentProps> = ({
  onClose,
  items,
  hasAllMilestonesReleased,
}) => {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const method = watch('decisionMethod');

  const fundingDecisionMethodOptions = useMilestoneReleaseDecisionMethods(
    Action.StagedPayment,
  );

  const noDecisionMethodAvailable = fundingDecisionMethodOptions.every(
    ({ isDisabled }) => isDisabled,
  );

  return (
    <>
      <h5 className="mb-1.5 heading-5">{formatText(MSG.title)}</h5>
      <p className="mb-6 text-md text-gray-600">
        {formatText(MSG.description)}
      </p>
      <p className="mb-2 text-1">{formatText(MSG.details)}</p>
      <ul className="mb-4 flex flex-col gap-2">
        {items.map(({ amount, milestone, tokenAddress, slotId }) => (
          <div key={slotId}>
            <MilestoneItem
              amount={amount}
              milestone={milestone}
              tokenAddress={tokenAddress}
            />
          </div>
        ))}
      </ul>
      <div className="mb-8">
        <DecisionMethodSelect
          options={fundingDecisionMethodOptions}
          name="decisionMethod"
        />
        {method && method.value && (
          <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
            <p className="text-sm text-gray-600">
              <span className="font-medium">
                {formatText({ id: 'fundingModal.note' })}
              </span>
              {milestoneReleaseDecisionMethodDescriptions[method.value]}
            </p>
          </div>
        )}
        {noDecisionMethodAvailable && (
          <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
            {formatText({
              id: 'fundingModal.noDecisionMethodAvailable',
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
            <Button mode="primarySolid" isFullSize type="submit">
              {formatText(
                hasAllMilestonesReleased && items.length > 1
                  ? MSG.releaseAllPayments
                  : MSG.releasePayment,
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const MilestoneReleaseModal: FC<MilestoneReleaseModalProps> = ({
  isOpen,
  items,
  onClose,
  hasAllMilestonesReleased,
  expenditure,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const validationSchema = getValidationSchema();
  const { stagedExpenditureAddress, votingReputationAddress } =
    useEnabledExtensions();

  const releaseExpenditureStageMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES,
    error: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_ERROR,
    success: ActionTypes.MOTION_RELEASE_EXPENDITURE_STAGES_SUCCESS,
  });
  const releaseExpenditureStage = useAsyncFunction({
    submit: ActionTypes.RELEASE_EXPENDITURE_STAGES,
    error: ActionTypes.RELEASE_EXPENDITURE_STAGES_ERROR,
    success: ActionTypes.RELEASE_EXPENDITURE_STAGES_SUCCESS,
  });

  const onSubmit = async ({ decisionMethod }) => {
    try {
      const motionPayload: ReleaseExpenditureStagesMotionPayload = {
        colonyAddress: colony.colonyAddress,
        colonyName: colony.name,
        stagedExpenditureAddress: stagedExpenditureAddress || '',
        votingReputationAddress: votingReputationAddress || '',
        expenditure,
        slotIds: items.map(({ slotId }) => slotId),
        motionDomainId: expenditure.nativeDomainId,
        tokenAddresses: [colony.nativeToken.tokenAddress],
      };
      const payload: ReleaseExpenditureStagesPayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        tokenAddresses: [colony.nativeToken.tokenAddress],
        stagedExpenditureAddress: stagedExpenditureAddress || '',
        slotIds: items.map(({ slotId }) => slotId),
        userAddress: user?.walletAddress || '',
      };

      if (
        decisionMethod &&
        decisionMethod.value === DecisionMethod.Reputation
      ) {
        await releaseExpenditureStageMotion(motionPayload);
      } else {
        await releaseExpenditureStage(payload);
      }

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} shouldShowHeader icon={HandCoins}>
      <Form
        className="flex h-full flex-col"
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        <MilestoneModalContent
          items={items}
          onClose={onClose}
          hasAllMilestonesReleased={hasAllMilestonesReleased}
        />
      </Form>
    </Modal>
  );
};

MilestoneReleaseModal.displayName = displayName;

export default MilestoneReleaseModal;
