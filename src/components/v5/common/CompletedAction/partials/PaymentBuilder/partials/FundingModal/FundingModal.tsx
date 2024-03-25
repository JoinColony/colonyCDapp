import { Wallet } from '@phosphor-icons/react';
import { BigNumber } from 'ethers';
import React, { useState, type FC } from 'react';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/index.ts';

import {
  fundingDecisionMethodDescriptions,
  fundingDecisionMethodItems,
  validationSchema,
} from './consts.ts';
import TokenItem from './TokenItem.tsx';
import { type FundingModalProps, type TokenItemProps } from './types.ts';

const FundingModal: FC<FundingModalProps> = ({
  onClose,
  expenditure,
  ...rest
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colony } = useColonyContext();

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

  const handleFundExpenditure = async () => {
    setIsSubmitting(true);
    try {
      if (!expenditure) {
        return;
      }

      const payload: FundExpenditurePayload = {
        colonyAddress: colony.colonyAddress,
        expenditure,
        fromDomainFundingPotId: 1,
      };

      await fundExpenditure(payload);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Modal {...rest} onClose={onClose} icon={Wallet}>
      <Form
        className="flex h-full flex-col"
        onSubmit={handleFundExpenditure}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {} }}
      >
        {({ watch }) => {
          const method = watch('decisionMethod');

          return (
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
                />
                {method && method.value && (
                  <div className="mt-4 rounded border border-gray-300 bg-base-bg p-[1.125rem]">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">
                        {formatText({ id: 'fundingModal.note' })}
                      </span>
                      {fundingDecisionMethodDescriptions[method.value]}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-auto flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
                <Button mode="primaryOutline" isFullSize onClick={onClose}>
                  {formatText({ id: 'button.cancel' })}
                </Button>
                <div className="flex w-full justify-center">
                  <Button
                    mode="primarySolid"
                    isFullSize
                    type="submit"
                    loading={isSubmitting}
                  >
                    {formatText({ id: 'fundingModal.accept' })}
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </Form>
    </Modal>
  );
};

export default FundingModal;
