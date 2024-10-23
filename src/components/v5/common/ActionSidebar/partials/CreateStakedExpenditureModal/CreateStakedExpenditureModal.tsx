import { LockKey, SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { bool, object, string } from 'yup';

import { Action } from '~constants/actions.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { usePaymentBuilderContext } from '~context/PaymentBuilderContext/PaymentBuilderContext.ts';
import { ExpenditureType } from '~gql';
import useExpenditureStaking from '~hooks/useExpenditureStaking.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import { ActionTypes } from '~redux';
import { TX_SEARCH_PARAM } from '~routes/routeConstants.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { mapPayload, pipe, withMeta } from '~utils/actions.ts';
import { formatText } from '~utils/intl.ts';
import { setQueryParamOnUrl } from '~utils/urls.ts';
import useReputationValidation from '~v5/common/ActionSidebar/hooks/useReputationValidation.ts';
import AmountField from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/PaymentBuilderTable/partials/AmountField/AmountField.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';

import {
  type CreateStakedExpenditureFormFields,
  type CreateStakedExpenditureModalProps,
} from './types.ts';
import { getCreateStakedExpenditurePayload } from './utils.ts';

const displayName =
  'v5.common.ActionSidebar.partials.CreateStakedExpenditureModal';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Create the payment',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'You need to stake tokens to create the payment. Depending on the outcome, you will either receive your full stake back or lose your stake if others collectively disagree with the payment.',
  },
  requiredStakeAmount: {
    id: `${displayName}.requiredStakeAmount`,
    defaultMessage: 'Required stake amount',
  },
  notEnoughTokens: {
    id: `${displayName}.notEnoughTokens`,
    defaultMessage: 'You don’t have enough funds to stake for this payment.',
  },
  cancel: {
    id: `${displayName}.cancel`,
    defaultMessage: 'Cancel',
  },
  createPayment: {
    id: `${displayName}.createPayment`,
    defaultMessage: 'Create payment',
  },
  reputationNotLoaded: {
    id: `${displayName}.reputationNotLoaded`,
    defaultMessage:
      'Reputation in the colony could not be loaded, please reload the page and try again.',
  },
});

const CreateStakedExpenditureModal: FC<CreateStakedExpenditureModalProps> = ({
  isOpen,
  onClose,
  formValues,
  actionType,
}) => {
  const { colony } = useColonyContext();
  const { setExpectedExpenditureType } = usePaymentBuilderContext();
  const { nativeToken } = colony;
  const { tokenAddress } = nativeToken;

  const {
    stakeAmount,
    stakedExpenditureAddress = '',
    hasEnoughTokens,
    isLoading,
    userActivatedTokens,
  } = useExpenditureStaking();
  const { networkInverseFee = '0' } = useNetworkInverseFee();
  const navigate = useNavigate();
  const { noReputationError } = useReputationValidation();

  if (!formValues) {
    return null;
  }

  const validationSchema = object()
    .shape({
      stakeAmount: string()
        .test('enough-reputation', '', () => !noReputationError)
        .defined()
        .required(),
      networkInverseFee: string().defined().required(),
      stakedExpenditureAddress: string().defined().required(),
      hasEnoughTokens: bool().required(),
    })
    .required();

  return (
    <Modal
      isOpen={isOpen}
      isFullOnMobile
      onClose={onClose}
      icon={LockKey}
      shouldShowHeader
    >
      <ActionForm<CreateStakedExpenditureFormFields>
        validationSchema={validationSchema}
        defaultValues={{
          stakeAmount,
          networkInverseFee,
          stakedExpenditureAddress,
          hasEnoughTokens,
        }}
        mode="onSubmit"
        actionType={ActionTypes.STAKED_EXPENDITURE_CREATE}
        className="h-full"
        transform={pipe(
          mapPayload(() =>
            getCreateStakedExpenditurePayload({
              actionType,
              colony,
              values: formValues,
              options: {
                networkInverseFee,
                stakeAmount: stakeAmount || '0',
                stakedExpenditureAddress,
                activeBalance: userActivatedTokens.toString(),
              },
            }),
          ),
          withMeta({
            setTxHash: (txHash: string) => {
              navigate(
                setQueryParamOnUrl({
                  params: { [TX_SEARCH_PARAM]: txHash },
                }),
                {
                  replace: true,
                },
              );
            },
          }),
        )}
        onSuccess={() => {
          if (actionType === Action.StagedPayment) {
            setExpectedExpenditureType(ExpenditureType.Staged);
          }
          onClose();
        }}
      >
        {({ formState: { errors, isSubmitting } }) => (
          <div className="flex h-full w-full flex-grow flex-col">
            <div className="flex-grow">
              <div>
                <h4 className="mb-2 heading-5">{formatText(MSG.title)}</h4>
                <p className="text-md text-gray-600">
                  {formatText(MSG.description)}
                </p>
              </div>
              <div className="mt-6 flex justify-between gap-4 rounded-[.25rem] bg-gray-50 px-[.875rem] py-3 text-md text-gray-900">
                <p className="font-medium">
                  {formatText(MSG.requiredStakeAmount)}
                </p>
                {isLoading ? (
                  <SpinnerLoader appearance={{ size: 'medium' }} />
                ) : (
                  <AmountField
                    amount={stakeAmount || '0'}
                    tokenAddress={tokenAddress}
                  />
                )}
              </div>
              {(!hasEnoughTokens || errors.hasEnoughTokens) && (
                <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
                  {formatText(MSG.notEnoughTokens)}
                </div>
              )}
              {(!stakeAmount || errors.stakeAmount) && (
                <div className="mt-4 rounded-[.25rem] border border-negative-300 bg-negative-100 p-[1.125rem] text-sm font-medium text-negative-400">
                  {formatText(MSG.reputationNotLoaded)}
                </div>
              )}
            </div>
            <div className="mt-auto flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row">
              <Button
                mode="primaryOutline"
                className="w-full md:w-[calc(50%-.375rem)]"
                onClick={onClose}
              >
                {formatText(MSG.cancel)}
              </Button>
              {isSubmitting || isLoading ? (
                <IconButton
                  className="w-full !text-md md:w-[calc(50%-.375rem)]"
                  rounded="s"
                  text={{ id: 'button.pending' }}
                  icon={
                    <span className="ml-1.5 flex shrink-0">
                      <SpinnerGap className="animate-spin" size={18} />
                    </span>
                  }
                />
              ) : (
                <Button
                  mode="primarySolid"
                  className="w-full md:w-[calc(50%-.375rem)]"
                  type="submit"
                >
                  {formatText(MSG.createPayment)}
                </Button>
              )}
            </div>
          </div>
        )}
      </ActionForm>
    </Modal>
  );
};

CreateStakedExpenditureModal.displayName = displayName;
export default CreateStakedExpenditureModal;
