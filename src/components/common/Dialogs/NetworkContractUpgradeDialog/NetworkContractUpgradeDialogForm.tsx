import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
} from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import NoPermissionMessage from '~shared/NoPermissionMessage';
// import {
//   useNetworkContracts,
//   useLegacyNumberOfRecoveryRolesQuery,
// } from '~data/index';
import { useDialogActionPermissions } from '~hooks'; // useEnabledExtensions
// import { colonyCanBeUpgraded } from '~utils/checks';

import LegacyPermissionWarning from './LegacyPermissionWarning';
import ContractVersionSection from './ContractVersionSection';

const displayName =
  'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Upgrade Colony',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you are upgrading this colony (optional)',
  },
  loadingData: {
    id: `${displayName}.loadingData`,
    defaultMessage: "Loading the Colony's Recovery Roles",
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const requiredRoles = [ColonyRole.Root];

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { version },
}: ActionDialogProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  // const {
  //   data,
  //   loading: loadingLegacyRecoveyRole,
  // } = useLegacyNumberOfRecoveryRolesQuery({
  //   variables: {
  //     colonyAddress,
  //   },
  // });

  // const { version: newVersion } = useNetworkContracts();

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony,
    false, // isVotingExtensionEnabled,
    requiredRoles,
    [Id.RootDomain],
  );
  // const canUpgradeVersion =
  //   userHasPermission && !!colonyCanBeUpgraded(colony, newVersion as string);

  const inputDisabled = onlyForceAction || isSubmitting; // !canUpgradeVersion ||

  // const PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES =
  //   data?.legacyNumberOfRecoveryRoles
  //     ? data?.legacyNumberOfRecoveryRoles > 1
  //     : false;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {/* {loadingLegacyRecoveyRole && (
        <DialogSection>
          <MiniSpinnerLoader
            className={styles.loadingInfo}
            loadingText={MSG.loadingData}
          />
        </DialogSection>
      )} */}
      {false && ( // PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES
        <DialogSection>
          <LegacyPermissionWarning />
        </DialogSection>
      )}
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={requiredRoles} />
        </DialogSection>
      )}
      <DialogSection>
        <ContractVersionSection currentVersion={version} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {/* {onlyForceAction && <NotEnoughReputation />}
      {cannotCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
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
          disabled={
            // cannotCreateMotion ||
            inputDisabled ||
            // PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES ||
            isSubmitting
          }
          dataTest="confirmButton"
          onSecondaryButtonClick={back}
          // loading={loadingLegacyRecoveyRole} @TODO: Add a loading prop when this data becomes available.
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
