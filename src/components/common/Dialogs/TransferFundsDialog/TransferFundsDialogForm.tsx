import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  ColonyRole,
  Id,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import PermissionsLabel from '~shared/PermissionsLabel';
import TokenAmountInput from '~shared/TokenAmountInput';
import DomainFundSelectorSection from '~shared/DomainFundSelectorSection';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import {
  useAppContext,
  useDialogActionPermissions,
  useTransformer,
} from '~hooks'; // useEnabledExtensions
import { getUserRolesForDomain } from '~redux/transformers';
import { userHasRole } from '~utils/checks';

import styles from './TransferFundsDialogForm.css';

const displayName = 'common.TransferFundsDialog.TransferFundsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Transfer Funds',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you’re transferring these funds (optional)',
  },
  noBalance: {
    id: `${displayName}.noBalance`,
    defaultMessage: 'Insufficient balance in from team pot',
  },
  noPermissionFrom: {
    id: `${displayName}.noPermissionFrom`,
    defaultMessage: `You need the {permissionLabel} permission in {domainName}
      to take this action`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const TransferFundsDialogForm = ({ back, colony }: ActionDialogProps) => {
  const { wallet } = useAppContext();
  const {
    getValues,
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const values = getValues();

  // const {
  //   isVotingExtensionEnabled,
  //   votingExtensionVersion,
  // } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

  const fromDomainId = values.fromDomain ? values.fromDomain : Id.RootDomain;
  const colonyDomains = colony?.domains?.items || [];
  const fromDomain = colonyDomains.find(
    (domain) => domain?.nativeId === fromDomainId,
  );
  const toDomainId = values.toDomain ? values.toDomain : undefined;
  const toDomain = colonyDomains.find(
    (domain) => domain?.nativeId === toDomainId,
  );

  const fromDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    fromDomainId,
  ]);

  const toDomainRoles = useTransformer(getUserRolesForDomain, [
    colony,
    wallet?.address,
    toDomainId,
  ]);
  const hasRoleInFromDomain = userHasRole(fromDomainRoles, ColonyRole.Funding);
  const hasRoleInToDomain = userHasRole(toDomainRoles, ColonyRole.Funding);
  const canTransferFunds = hasRoleInFromDomain && hasRoleInToDomain;

  const requiredRoles: ColonyRole[] = [ColonyRole.Funding];

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony?.colonyAddress || '',
    canTransferFunds,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && (
        <div className={styles.permissionsRequired}>
          <DialogSection>
            <PermissionRequiredInfo requiredRoles={requiredRoles} />
          </DialogSection>
        </div>
      )}
      <DialogSection>
        <DomainFundSelectorSection
          colony={colony}
          transferBetweenDomains
          disabled={onlyForceAction}
        />
      </DialogSection>
      <DialogSection>
        <TokenAmountInput colony={colony} disabled={inputDisabled} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
          dataTest="transferFundsAnnotation"
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <span className={styles.permissionsError}>
            <FormattedMessage
              {...MSG.noPermissionFrom}
              values={{
                permissionLabel: (
                  <PermissionsLabel
                    permission={ColonyRole.Funding}
                    name={{ id: `role.${ColonyRole.Funding}` }}
                  />
                ),
                domainName:
                  (!hasRoleInFromDomain && fromDomain?.name) ||
                  (!hasRoleInToDomain && toDomain?.name),
              }}
            />
          </span>
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {/* {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.cannotCreateMotion}>
            <FormattedMessage
              {...MSG.cannotCreateMotion}
              values={{
                version:
                  VotingReputationVersion.FuchsiaLightweightSpaceship,
              }}
            />
          </div>
        </DialogSection>
      )} */}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          onSecondaryButtonClick={back}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          dataTest="transferFundsConfirmation"
        />
      </DialogSection>
    </>
  );
};

TransferFundsDialogForm.displayName = displayName;

export default TransferFundsDialogForm;
