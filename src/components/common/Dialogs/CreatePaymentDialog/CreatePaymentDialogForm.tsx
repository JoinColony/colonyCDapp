import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { isConfusing } from '@colony/unicode-confusables-noascii';
import { useFormContext } from 'react-hook-form';

import ConfusableWarning from '~shared/ConfusableWarning';
import {
  ActionDialogProps,
  DialogSection,
  DialogHeading,
  DialogControls,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { ColonyWatcher } from '~types';

import DomainFundSelectorSection from '../DomainFundSelectorSection';
import TokenAmountInput from '../TokenAmountInput';
import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
} from '../Messages';

import { useCreatePaymentDialogStatus } from './helpers';

import styles from './CreatePaymentDialogForm.css';

const displayName = 'common.CreatePaymentDialog.CreatePaymentDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Payment',
  },
  to: {
    id: `${displayName}.to`,
    defaultMessage: 'Assignee',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re making this payment (optional)',
  },
  noOneTxExtension: {
    id: `${displayName}.noOneTxExtension`,
    defaultMessage: `The OneTxPayment extension is not installed in this colony.
    Please use the Extensions Manager to install it if you want to make a new
    payment.`,
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  warningText: {
    id: `${displayName}.warningText`,
    defaultMessage: `<span>Warning.</span> You are about to make a payment to an address not on the whitelist. Are you sure the address is correct?`,
  },
});

interface Props extends ActionDialogProps {
  verifiedUsers: ColonyWatcher['user'][];
  // showWhitelistWarning: boolean;
}

const requiredRoles: ColonyRole[] = [
  ColonyRole.Funding,
  ColonyRole.Administration,
];

const CreatePaymentDialogForm = ({
  back,
  verifiedUsers,
  colony,
  enabledExtensionData,
}: // showWhitelistWarning,
Props) => {
  const { watch } = useFormContext();
  const recipient = watch('recipient');

  const {
    userHasPermission,
    disabledSubmit,
    disabledInput,
    canCreateMotion,
    canCreatePayment,
  } = useCreatePaymentDialogStatus(colony, requiredRoles, enabledExtensionData);

  const formattedData = verifiedUsers.map((user) => ({
    ...user,
    id: user.walletAddress,
  }));

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <DomainFundSelectorSection
          colony={colony}
          disabled={!canCreatePayment}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.singleUserContainer}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={formattedData}
            label={MSG.to}
            name="recipient"
            filter={filterUserSelection}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            dataTest="paymentRecipientPicker"
            itemDataTest="paymentRecipientItem"
            valueDataTest="paymentRecipientName"
          />
        </div>
        {/* {showWhitelistWarning && (
          <div className={styles.warningContainer}>
            <p className={styles.warningText}>
              <FormattedMessage
                {...MSG.warningText}
                values={{
                  span: (chunks) => (
                    <span className={styles.warningLabel}>{chunks}</span>
                  ),
                }}
              />
            </p>
          </div>
        )} */}
        {recipient &&
          isConfusing(
            recipient.walletAddress || recipient.profile?.displayName,
          ) && (
            <ConfusableWarning
              walletAddress={recipient.walletAddress}
              colonyAddress={colony?.colonyAddress}
            />
          )}
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={disabledInput} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={disabledInput}
          dataTest="paymentAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {userHasPermission && !canCreatePayment && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noOneTxExtension}>
            <FormattedMessage {...MSG.noOneTxExtension} />
          </div>
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={domainId}
        />
      )} */}
      {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="paymentConfirmButton"
          isVotingReputationEnabled={enabledExtensionData.isVotingReputationEnabled}
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName = displayName;

export default CreatePaymentDialogForm;
