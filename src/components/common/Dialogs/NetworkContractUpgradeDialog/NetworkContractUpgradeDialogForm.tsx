import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { FormState } from 'react-hook-form';

import Button from '~shared/Button';
import { ActionDialogProps } from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import { Annotations } from '~shared/Fields'; // ForceToggle
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
// import { MiniSpinnerLoader } from '~shared/Preloaders';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

// import {
//   useNetworkContracts,
//   useLegacyNumberOfRecoveryRolesQuery,
// } from '~data/index';
import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
// import { colonyCanBeUpgraded } from '~utils/checks';

import { FormValues } from './NetworkContractUpgradeDialog';

import styles from './NetworkContractUpgradeDialogForm.css';

const displayName =
  'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Upgrade Colony',
  },
  currentVersion: {
    id: `${displayName}.currentVersion`,
    defaultMessage: 'Current version',
  },
  newVersion: {
    id: `${displayName}.newVersion`,
    defaultMessage: 'New version',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: 'Explain why you are upgrading this colony (optional)',
  },
  noPermissionText: {
    id: `${displayName}.noPermissionText`,
    defaultMessage: `You do not have the {requiredRole} permission required
      to take this action.`,
  },
  legacyPermissionsWarningTitle: {
    id: `${displayName}.legacyPermissionsWarningTitle`,
    defaultMessage: `Upgrade to the next colony version is prevented while more than one colony member has the {recoveryRole} role.`,
  },
  legacyPermissionsWarningDescription: {
    id: `${displayName}.legacyPermissionsWarningDescription`,
    defaultMessage: `
Please remove the {recoveryRole} role from all members {highlightInstruction}
the member who will upgrade the colony. Once complete, you will be able to
safely upgrade the colony to the next version.
    `,
  },
  legacyPermissionsWarningPost: {
    id: `${displayName}.legacyPermissionsWarningPost`,
    defaultMessage: `After the upgrade you can safely re-assign the {recoveryRole} role to members.`,
  },
  legacyPermissionsWarninghighlightInstruction: {
    id: `${displayName}.highlightInstruction`,
    defaultMessage: `except`,
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

interface Props extends ActionDialogProps {
  values: FormValues;
}

const NetworkContractUpgradeDialogForm = ({
  back,
  colony, // version, colonyAddress
  isSubmitting,
  values,
}: Props & FormState<FormValues>) => {
  const { user } = useAppContext();

  // const {
  //   data,
  //   loading: loadingLegacyRecoveyRole,
  // } = useLegacyNumberOfRecoveryRolesQuery({
  //   variables: {
  //     colonyAddress,
  //   },
  // });

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);

  const hasRegisteredProfile = !!user?.name && !!user.walletAddress;

  // const { version: newVersion } = useNetworkContracts();

  const currentVersion = parseInt('1', 10); // version
  const nextVersion = currentVersion + 1;
  const networkVersion = parseInt('1', 10); // newVersion ||

  const hasRootPermission = hasRegisteredProfile && hasRoot(allUserRoles);

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [, onlyForceAction] = useDialogActionPermissions(
    // userHasPermission
    colony.colonyAddress,
    hasRootPermission,
    false, // isVotingExtensionEnabled,
    values.forceAction,
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
        <div className={styles.modalHeading}>
          {/*
           * @NOTE Always disabled since you can only create this motion in root
           */}
          {/* {isVotingExtensionEnabled && (
            <div className={styles.motionVoteDomain}>
              <MotionDomainSelect
                colony={colony}
                disabled
              />
            </div>
          )} */}
          <div className={styles.headingContainer}>
            <Heading3
              appearance={{ margin: 'none', theme: 'dark' }}
              text={MSG.title}
            />
            {/* {canUpgradeVersion && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
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
          <div className={styles.permissionsWarning}>
            <div className={styles.warningTitle}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningTitle}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                }}
              />
            </div>
            <div className={styles.warningDescription}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningDescription}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                  highlightInstruction: (
                    <span className={styles.highlightInstruction}>
                      <FormattedMessage
                        {...MSG.legacyPermissionsWarninghighlightInstruction}
                      />
                    </span>
                  ),
                }}
              />
            </div>
            <div className={styles.warningDescription}>
              <FormattedMessage
                {...MSG.legacyPermissionsWarningPost}
                values={{
                  recoveryRole: (
                    <PermissionsLabel permission={ColonyRole.Recovery} />
                  ),
                }}
              />
            </div>
          </div>
        </DialogSection>
      )}
      {!hasRootPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <div className={styles.contractVersionLine}>
          <FormattedMessage {...MSG.currentVersion} />
          <div className={styles.contractVersionNumber}>{currentVersion}</div>
        </div>
        <hr className={styles.divider} />
        <div className={styles.contractVersionLine}>
          <FormattedMessage {...MSG.newVersion} />
          <div className={styles.contractVersionNumber}>
            {nextVersion < networkVersion ? nextVersion : networkVersion}
          </div>
        </div>
        <hr className={styles.divider} />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!hasRootPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.noPermissionMessage}>
            <FormattedMessage
              {...MSG.noPermissionText}
              values={{
                requiredRole: (
                  <PermissionsLabel
                    permission={ColonyRole.Root}
                    name={{ id: `role.${ColonyRole.Root}` }}
                  />
                ),
              }}
            />
          </div>
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
        {back && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={back}
            text={{ id: 'button.back' }}
          />
        )}
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            values.forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          disabled={
            // cannotCreateMotion ||
            inputDisabled ||
            // PREVENT_UPGRADE_IF_LEGACY_RECOVERY_ROLES ||
            isSubmitting
          }
          style={{ minWidth: styles.wideButton }}
          loading={isSubmitting} // || loadingLegacyRecoveyRole
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
