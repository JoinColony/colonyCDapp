import { unformatNumeral } from 'cleave-zen';
import moveDecimal from 'move-decimal-point';
import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks';
import { useGetAllTokens } from '~hooks/useGetAllTokens.ts';
import useNetworkInverseFee from '~hooks/useNetworkInverseFee.ts';
import useUserByAddress from '~hooks/useUserByAddress.ts';
import { Form } from '~shared/Fields/index.ts';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import { ColonyActionType, type ColonyAction } from '~types/graphql.ts';
import { findDomainByNativeId } from '~utils/domains.ts';
import {
  convertPeriodToHours,
  convertPeriodToSeconds,
} from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import { getTokenDecimalsWithFallback } from '~utils/tokens.ts';
import { useGetExpenditureData } from '~v5/common/ActionSidebar/hooks/useGetExpenditureData.ts';
import PaymentBuilderRecipientsField from '~v5/common/ActionSidebar/partials/forms/PaymentBuilderForm/partials/PaymentBuilderRecipientsField/PaymentBuilderRecipientsField.tsx';
import Button from '~v5/shared/Button/Button.tsx';
import UserInfoPopover from '~v5/shared/UserInfoPopover/UserInfoPopover.tsx';

import {
  ActionDataGrid,
  ActionSubtitle,
  ActionTitle,
} from '../Blocks/index.ts';
import EditModeModal from '../EditModeModal/EditModeModal.tsx';
import ActionTypeRow from '../rows/ActionType.tsx';
import CreatedInRow from '../rows/CreatedIn.tsx';
import DecisionMethodRow from '../rows/DecisionMethod.tsx';
import DescriptionRow from '../rows/Description.tsx';
import TeamFromRow from '../rows/TeamFrom.tsx';

import { useValidationSchema } from './hooks.ts';
import Errors from './partials/Errors/Errors.tsx';

interface PaymentBuilderEditProps {
  action: ColonyAction;
}

const displayName = 'v5.common.CompletedAction.partials.PaymentBuilderEdit';

const MSG = defineMessages({
  defaultTitle: {
    id: `${displayName}.defaultTitle`,
    defaultMessage: 'Advanced payment',
  },
  makeChanges: {
    id: `${displayName}.makeChanges`,
    defaultMessage: 'Make changes',
  },
  cancelEditMode: {
    id: `${displayName}.cancelEditMode`,
    defaultMessage: 'Cancel edit mode',
  },
});

const PaymentBuilderEdit: FC<PaymentBuilderEditProps> = ({ action }) => {
  const { customTitle = formatText(MSG.defaultTitle) } = action?.metadata || {};
  const { initiatorUser } = action;
  const { colony } = useColonyContext();
  const allTokens = useGetAllTokens();
  const { networkInverseFee = '0' } = useNetworkInverseFee();
  const {
    cancelEditModalToggle: [, { toggleOn: toggleOnCancelModal }],
    setEditValues,
    editValues,
  } = useActionSidebarContext();
  const isMobile = useMobile();

  const validationSchema = useValidationSchema(networkInverseFee);

  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action.expenditureId,
  );
  const { user: recipient } = useUserByAddress(
    expenditure?.slots?.[0]?.recipientAddress || '',
  );

  if (loadingExpenditure) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <SpinnerLoader appearance={{ size: 'huge' }} />
        <p className="text-gray-600">
          {formatText({ id: 'actionSidebar.loading' })}
        </p>
      </div>
    );
  }

  if (!expenditure) {
    return null;
  }

  const { slots = [], metadata } = expenditure;

  const selectedTeam = findDomainByNativeId(
    metadata?.fundFromDomainNativeId,
    colony,
  );

  const tokensCount = slots.reduce((uniqueTokens: string[], item) => {
    const token = item.payouts?.[0].tokenAddress;

    if (token) {
      if (!uniqueTokens.includes(token)) {
        uniqueTokens.push(token);
      }
    }

    return uniqueTokens;
  }, []).length;

  const payments = slots.map((slot) => {
    const token = allTokens.find(
      ({ token: currentToken }) =>
        currentToken.tokenAddress === slot.payouts?.[0].tokenAddress,
    );

    return {
      recipient: slot.recipientAddress,
      amount: moveDecimal(
        slot.payouts?.[0].amount,
        -getTokenDecimalsWithFallback(token?.token.decimals),
      ),
      tokenAddress: slot.payouts?.[0].tokenAddress,
      delay: convertPeriodToHours(slot.claimDelay || '0'),
    };
  });

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <ActionTitle>{customTitle}</ActionTitle>
      </div>
      <ActionSubtitle>
        {formatText(
          { id: 'action.title' },
          {
            actionType: ColonyActionType.CreateExpenditure,
            initiator: initiatorUser ? (
              <UserInfoPopover
                walletAddress={initiatorUser.walletAddress}
                user={initiatorUser}
                withVerifiedBadge={false}
              >
                {initiatorUser.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipient: recipient ? (
              <UserInfoPopover
                walletAddress={recipient.walletAddress || ''}
                user={recipient}
                withVerifiedBadge={false}
              >
                {recipient.profile?.displayName}
              </UserInfoPopover>
            ) : null,
            recipientsNumber: slots?.length,
            tokensNumber: tokensCount,
          },
        )}
      </ActionSubtitle>
      <ActionDataGrid>
        <ActionTypeRow actionType={ColonyActionType.CreateExpenditure} />
        {selectedTeam?.metadata && (
          <TeamFromRow
            teamMetadata={selectedTeam.metadata}
            actionType={action.type}
          />
        )}
        <DecisionMethodRow action={action} />
        {action.motionData?.motionDomain.metadata && (
          <CreatedInRow
            motionDomainMetadata={action.motionData.motionDomain.metadata}
          />
        )}
      </ActionDataGrid>
      {action.annotation?.message && (
        <DescriptionRow description={action.annotation.message} />
      )}
      <Form
        defaultValues={{ payments }}
        onSubmit={(values) => {
          const mappedValues = values.payments.map((payment) => ({
            recipientAddress: payment.recipient,
            tokenAddress: payment.tokenAddress,
            claimDelay: convertPeriodToSeconds(
              Number(unformatNumeral(payment.delay)),
            ),
            amount: payment.amount,
          }));

          setEditValues(mappedValues as ExpenditurePayoutFieldValue[]);
        }}
        validationSchema={validationSchema}
      >
        {({ formState }) => {
          const { errors } = formState;

          return (
            <>
              <PaymentBuilderRecipientsField name="payments" />
              {Object.keys(errors).length > 0 && <Errors errors={errors} />}
              <div className="absolute bottom-0 right-0 w-full sm:right-[23.75rem] sm:border-r sm:border-r-gray-200">
                <div className="flex flex-col items-center justify-end gap-2 p-6 sm:flex-row">
                  <Button
                    mode="primaryOutline"
                    onClick={toggleOnCancelModal}
                    isFullSize={isMobile}
                  >
                    {formatText(MSG.cancelEditMode)}
                  </Button>
                  <Button type="submit" isFullSize={isMobile}>
                    {formatText(MSG.makeChanges)}
                  </Button>
                </div>
              </div>
            </>
          );
        }}
      </Form>
      <EditModeModal
        isOpen={!!editValues}
        onClose={() => setEditValues(undefined)}
        expenditure={expenditure}
      />
    </>
  );
};

PaymentBuilderEdit.displayName = displayName;

export default PaymentBuilderEdit;
