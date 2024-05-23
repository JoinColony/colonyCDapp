import { Id } from '@colony/colony-js';
import { SpinnerGap, Wallet } from '@phosphor-icons/react';
import { BigNumber } from 'ethers';
import React, { useState, type FC } from 'react';
import { type SingleValue } from 'react-select';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useEnabledExtensions from '~hooks/useEnabledExtensions.ts';
import { ActionTypes } from '~redux';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { type ExpenditureFundMotionPayload } from '~redux/types/actions/motion.ts';
import { Form } from '~shared/Fields/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import TxButton from '~v5/shared/Button/TxButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';
import { type DecisionMethodOption } from '../DecisionMethodSelect/types.ts';

import {
  fundingDecisionMethodDescriptions,
  getFundingDecisionMethodItems,
  validationSchema,
} from './consts.ts';
import TokenItem from './TokenItem.tsx';
import { type FundingModalProps, type TokenItemProps } from './types.ts';

const FundingModal: FC<FundingModalProps> = ({
  onClose,
  expenditure,
  onSuccess,
  ...rest
}) => {
  const [fundingMethod, setFundingMethod] =
    useState<SingleValue<DecisionMethodOption>>();
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();

  const fundingDecisionMethodItems = getFundingDecisionMethodItems(
    isVotingReputationEnabled,
  );

  const fundingItems = expenditure.slots.reduce<TokenItemProps[]>(
    (acc, item) => {
      if (!item.payouts) return acc;

      item.payouts.forEach((payout) => {
        const existingItemIndex = acc.findIndex(
          (existingItem) => existingItem.tokenAddress === payout.tokenAddress,
        );
        if (existingItemIndex !== -1) {
          const existingItem = acc[existingItemIndex];

          existingItem.amount = BigNumber.from(existingItem.amount)
            .add(BigNumber.from(payout.amount))
            .toString();
          existingItem.networkFee = BigNumber.from(existingItem.networkFee)
            .add(BigNumber.from(payout.networkFee))
            .toString();
        } else {
          acc.push({
            tokenAddress: payout.tokenAddress,
            amount: payout.amount,
            networkFee: payout.networkFee,
          });
        }
      });
      return acc;
    },
    [],
  );

  const fundExpenditure = useAsyncFunction({
    submit: ActionTypes.EXPENDITURE_FUND,
    error: ActionTypes.EXPENDITURE_FUND_ERROR,
    success: ActionTypes.EXPENDITURE_FUND_SUCCESS,
  });

  const fundExpenditureViaMotion = useAsyncFunction({
    submit: ActionTypes.MOTION_EXPENDITURE_FUND,
    error: ActionTypes.MOTION_EXPENDITURE_FUND_ERROR,
    success: ActionTypes.MOTION_EXPENDITURE_FUND_SUCCESS,
  });

  const isFundingMotion =
    fundingMethod && fundingMethod.value === DecisionMethod.Reputation;

  const handleFundExpenditure = async () => {
    try {
      if (!expenditure) {
        return;
      }

      const motionPayload: ExpenditureFundMotionPayload = {
        colony,
        expenditure,
        motionDomainId: Id.RootDomain,
        fromDomainFundingPotId: Id.RootDomain,
        fromDomainId: Id.RootDomain,
      };

      const payload: FundExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        fromDomainFundingPotId: 1,
      };

      if (isFundingMotion) {
        await fundExpenditureViaMotion(motionPayload);
      } else {
        await fundExpenditure(payload);
      }

      onSuccess();

      onClose();
    } catch (err) {
      onClose();
    }
  };

  return (
    <Modal
      {...rest}
      onClose={onClose}
      showHeaderProps={{ className: 'right-6 top-[2.0625rem]' }}
      icon={Wallet}
    >
      <Form
        className="flex h-full flex-col"
        onSubmit={handleFundExpenditure}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        {({ formState: { isSubmitting } }) => (
          <>
            <h5 className="mb-2 heading-5">
              {formatText({ id: 'fundingModal.title' })}
            </h5>
            <p className="mb-6 text-md text-gray-600">
              {formatText({ id: 'fundingModal.description' })}
            </p>
            <h6 className="mb-2 text-2">
              {formatText({ id: 'fundingModal.fundsRequired' })}
            </h6>
            <div className="mb-4 rounded bg-gray-50 px-3.5 py-3">
              <div className="mb-4 flex items-center justify-between uppercase text-gray-600 text-4">
                <span>{formatText({ id: 'fundingModal.asset' })}</span>
                <span>{formatText({ id: 'fundingModal.amount' })}</span>
              </div>
              {fundingItems.map(({ tokenAddress, amount, networkFee }) => (
                <div key={tokenAddress} className="mb-4 last:mb-0">
                  <TokenItem
                    tokenAddress={tokenAddress}
                    amount={amount}
                    networkFee={networkFee}
                  />
                </div>
              ))}
            </div>
            <div className="mb-8">
              <DecisionMethodSelect
                options={fundingDecisionMethodItems}
                name="decisionMethod"
                onChange={(newValue) => setFundingMethod(newValue)}
              />
              {fundingMethod && fundingMethod.value && (
                <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">
                      {formatText({ id: 'fundingModal.note' })}
                    </span>
                    {fundingDecisionMethodDescriptions[fundingMethod.value]}
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
                  <Button mode="primarySolid" isFullSize type="submit">
                    {formatText({ id: 'fundingModal.accept' })}
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FundingModal;
