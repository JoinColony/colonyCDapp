import { Id } from '@colony/colony-js';
import { SpinnerGap, Wallet } from '@phosphor-icons/react';
import { BigNumber } from 'ethers';
import React, { useEffect, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { getRole } from '~constants/permissions.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import { ActionTypes } from '~redux';
import { type FundExpenditurePayload } from '~redux/sagas/expenditures/fundExpenditure.ts';
import { type ExpenditureFundMotionPayload } from '~redux/types/actions/motion.ts';
import { Form } from '~shared/Fields/index.ts';
import { getAllUserRoles } from '~transformers';
import { DecisionMethod } from '~types/actions.ts';
import { extractColonyRoles } from '~utils/colonyRoles.ts';
import { extractColonyDomains, findDomainByNativeId } from '~utils/domains.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import DecisionMethodSelect from '../DecisionMethodSelect/DecisionMethodSelect.tsx';

import {
  getFundingDecisionMethodDescriptions,
  getValidationSchema,
} from './consts.ts';
import { useFundingDecisionMethods } from './hooks.ts';
import TokenItem from './TokenItem.tsx';
import {
  type FundingModalContentProps,
  type FundingModalProps,
  type TokenItemProps,
} from './types.ts';

const displayName =
  'v5.common.CompletedAction.partials.PaymentBuilder.partials.FundingModal';

const MSG = defineMessages({
  notEnoughTokens: {
    id: `${displayName}.notEnoughTokens`,
    defaultMessage:
      'There are not enough funds in {team} to fund this payment. Ensure there are enough funds in the team before trying again.',
  },
});

const FundingModalContent: FC<FundingModalContentProps> = ({
  fundingItems,
  onClose,
  teamName,
  actionType,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const {
    watch,
    formState: { isSubmitting, errors },
    trigger,
  } = useFormContext();
  const method = watch('decisionMethod');

  const colonyRoles = extractColonyRoles(colony.roles);
  const userPermissions = getAllUserRoles(colonyRoles, user?.walletAddress);
  const userRole = getRole(userPermissions);
  const fundingDecisionMethodDescriptions =
    getFundingDecisionMethodDescriptions(userRole.name);

  const fundingDecisionMethodOptions = useFundingDecisionMethods(actionType);

  const noDecisionMethodAvailable = fundingDecisionMethodOptions.every(
    ({ isDisabled }) => isDisabled,
  );

  useEffect(() => {
    trigger('fundingItems');
  }, [trigger]);

  const hasEnoughFunds = !errors.fundingItems;

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
          options={fundingDecisionMethodOptions}
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
        {!hasEnoughFunds && (
          <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm text-negative-400">
            {formatText(MSG.notEnoughTokens, {
              team: teamName,
            })}
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
              {formatText({ id: 'fundingModal.accept' })}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

const FundingModal: FC<FundingModalProps> = ({
  onClose,
  expenditure,
  onSuccess,
  actionType,
  ...rest
}) => {
  const { colony } = useColonyContext();
  const { slots, metadata } = expenditure;
  const selectedTeam = findDomainByNativeId(
    metadata?.fundFromDomainNativeId,
    colony,
  );

  const fundingItems = slots.reduce<TokenItemProps[]>((acc, item) => {
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
  }, []);

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
  const fundExpenditureViaMultisig = useAsyncFunction({
    submit: ActionTypes.MULTISIG_EXPENDITURE_FUND,
    error: ActionTypes.MULTISIG_EXPENDITURE_FUND_ERROR,
    success: ActionTypes.MULTISIG_EXPENDITURE_FUND_SUCCESS,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleFundExpenditure = async ({ decisionMethod, ...restValues }) => {
    try {
      if (!expenditure || !selectedTeam) {
        return;
      }

      const commonPayload = {
        expenditure,
        colonyRoles: extractColonyRoles(colony.roles),
        colonyDomains: extractColonyDomains(colony.domains),
      };

      const motionPayload: ExpenditureFundMotionPayload = {
        ...commonPayload,
        colony,
        motionDomainId: Id.RootDomain,
        fromDomainFundingPotId: Id.RootDomain,
        fromDomainId: Id.RootDomain,
      };

      const payload: FundExpenditurePayload = {
        ...commonPayload,
        colonyAddress: colony.colonyAddress,
        expenditure,
        fromDomainFundingPotId: selectedTeam.nativeFundingPotId,
      };

      if (
        decisionMethod &&
        decisionMethod.value === DecisionMethod.Reputation
      ) {
        await fundExpenditureViaMotion(motionPayload);
      } else if (decisionMethod.value === DecisionMethod.MultiSig) {
        await fundExpenditureViaMultisig(payload);
      } else {
        await fundExpenditure(payload);
      }

      onSuccess();

      onClose();
    } catch (err) {
      onClose();
    }
  };

  const validationSchema = getValidationSchema(selectedTeam?.nativeId, colony);

  return (
    <Modal {...rest} onClose={onClose} shouldShowHeader icon={Wallet}>
      <Form
        className="flex h-full flex-col"
        onSubmit={handleFundExpenditure}
        validationSchema={validationSchema}
        defaultValues={{ decisionMethod: {}, fundingItems }}
      >
        <FundingModalContent
          fundingItems={fundingItems}
          onClose={onClose}
          teamName={selectedTeam?.metadata?.name || ''}
          actionType={actionType}
        />
      </Form>
    </Modal>
  );
};

export default FundingModal;
