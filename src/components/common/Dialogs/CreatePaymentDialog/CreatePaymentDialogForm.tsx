import React, { useMemo, useState } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { isConfusing } from '@colony/unicode-confusables-noascii';
import { useFormContext } from 'react-hook-form';

import PermissionsLabel from '~shared/PermissionsLabel';
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
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';

// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import { ColonyWatcher } from '~types';

import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
} from '~hooks';
// import { useEnabledExtensions } from '~hooks/useEnabledExtensions';
import { getUserRolesForDomain } from '~redux/transformers';
import { userHasRole } from '~utils/checks';

import DomainFundSelector from './DomainFundSelector';
import TokenAmountInput from './TokenAmountInput';

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
  noPermissionFrom: {
    id: `${displayName}.noPermissionFrom`,
    defaultMessage: `You do not have the {firstRoleRequired} and
    {secondRoleRequired} permissions required to take this action.`,
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
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  verifiedUsers: ColonyWatcher['user'][];
  // showWhitelistWarning: boolean;
  filteredDomainId?: number;
}

const CreatePaymentDialogForm = ({
  back,
  verifiedUsers,
  filteredDomainId: preselectedDomainId,
  colony,
}: // showWhitelistWarning,
Props) => {
  const { wallet } = useAppContext();
  const {
    getValues,
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const values = getValues();
  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? Id.RootDomain
      : preselectedDomainId;

  const domainId = values.domainId
    ? parseInt(values.domainId, 10)
    : selectedDomain;
  /*
   * Custom error state tracking
   */
  const [customAmountError] = useState<
    // setCustomAmountError
    MessageDescriptor | string | undefined
  >(undefined);

  // const {
  //   isOneTxPaymentExtensionEnabled,
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    domainId,
  ]);

  const userHasFundingPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Funding,
  );
  const userHasAdministrationPermission = userHasRole(
    fromDomainRoles,
    ColonyRole.Administration,
  );
  const hasRoles = userHasFundingPermission && userHasAdministrationPermission;
  const requiredRoles: ColonyRole[] = [
    ColonyRole.Funding,
    ColonyRole.Administration,
  ];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony?.colonyAddress || '',
    hasRoles,
    false, // isVotingExtensionEnabled,
    values.forceAction,
    domainId,
  );

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  const canMakePayment = userHasPermission; // && isOneTxPaymentExtensionEnabled;

  const inputDisabled = !canMakePayment || onlyForceAction || isSubmitting;

  const formattedData = useMemo(
    () => verifiedUsers.map((user) => ({ ...user, id: user.walletAddress })),
    [verifiedUsers],
  );

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
        <DomainFundSelector
          colony={colony}
          filteredDomainId={preselectedDomainId}
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
            disabled={inputDisabled}
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
        {values.recipient &&
          isConfusing(
            values.recipient.profile.walletAddress ||
              values.recipient.profile?.displayName,
          ) && (
            <ConfusableWarning
              walletAddress={values.recipient.profile.walletAddress}
              colonyAddress={colony?.colonyAddress}
            />
          )}
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={inputDisabled} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="paymentAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                firstRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                secondRoleRequired: (
                  <PermissionsLabel
                    permission={ColonyRole.Administration}
                    name={{ id: `role.${ColonyRole.Administration}` }}
                  />
                ),
              }}
            />
          </div>
        </DialogSection>
      )}
      {/* {userHasPermission && !isOneTxPaymentExtensionEnabled && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage {...MSG.noOneTxExtension} />
          </div>
        </DialogSection>
      )} */}
      {/* {onlyForceAction && (
        <NotEnoughReputation
          appearance={{ marginTop: 'negative' }}
          domainId={domainId}
        />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionFromMessage}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationExtensionVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          back={back}
          disabled={
            // cannotCreateMotion ||
            !isValid || !!customAmountError || inputDisabled
          }
          dataTest="paymentConfirmButton"
        />
      </DialogSection>
    </>
  );
};

CreatePaymentDialogForm.displayName = displayName;

export default CreatePaymentDialogForm;
