import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogSection,
  DialogHeading,
  DialogControls,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';

import { MemberUser, SetStateFn } from '~types';

import PaymentRecipient from './PaymentRecipient';
import DomainFundSelectorSection from '../DomainFundSelectorSection';
import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
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
    defaultMessage: "Explain why you're making this payment (optional)",
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
});

interface Props extends ActionDialogProps {
  verifiedUsers: MemberUser[];
  handleIsForceChange: SetStateFn;
  isForce: boolean;
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
  handleIsForceChange,
  isForce,
}: Props) => {
  const { watch } = useFormContext();
  const { fromDomainId, forceAction } = watch();

  const {
    userHasPermission,
    disabledSubmit,
    disabledInput,
    canCreatePayment,
    canOnlyForceAction,
    hasMotionCompatibleVersion,
    showPermissionErrors,
  } = useCreatePaymentDialogStatus(colony, requiredRoles, enabledExtensionData);

  const { fields /* append */ } = useFieldArray({
    name: 'payments',
  });

  useEffect(() => {
    if (forceAction !== isForce) {
      handleIsForceChange(forceAction);
    }
  }, [forceAction, isForce, handleIsForceChange]);

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading
          title={MSG.title}
          colony={colony}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          selectedDomainId={fromDomainId}
        />
      </DialogSection>
      {showPermissionErrors && (
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
      {fields.map(({ id }, index) => (
        <PaymentRecipient
          key={id}
          index={index}
          verifiedUsers={verifiedUsers}
          colony={colony}
          disabled={disabledInput}
        />
      ))}
      {/* Disabling the ability to add more payments for the launch */}
      {/* <DialogSection>
        <button
          type="button"
          onClick={() => {
            append({
              recipient: undefined,
              amount: 0,
              tokenAddress: colony?.nativeToken.tokenAddress,
            });
          }}
        >
          Add another payment
        </button>
      </DialogSection> */}
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={disabledInput}
          dataTest="paymentAnnotation"
        />
      </DialogSection>
      {showPermissionErrors && (
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
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation
            appearance={{ marginTop: 'negative' }}
            domainId={fromDomainId}
            includeForceCopy={userHasPermission}
          />
        </DialogSection>
      )}
      {!hasMotionCompatibleVersion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={disabledSubmit}
          dataTest="paymentConfirmButton"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName = displayName;

export default CreatePaymentDialogForm;
