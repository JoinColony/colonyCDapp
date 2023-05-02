import React from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';

import { useColonyContractVersion } from '~hooks';
import { ActionDialogProps, DialogControls, DialogHeading, DialogSection } from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import { MiniSpinnerLoader } from '~shared/Preloaders';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { CannotCreateMotionMessage, NoPermissionMessage, PermissionRequiredInfo } from '../Messages';

import LegacyPermissionWarning from './LegacyPermissionWarning';
import ContractVersionSection from './ContractVersionSection';
import { useNetworkContractUpgradeDialogStatus } from './helpers';

import styles from './NetworkContractUpgradeDialogForm.css';

const displayName = 'common.NetworkContractUpgradeDialog.NetworkContractUpgradeDialogForm';

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
    defaultMessage: "Loading the colony's recovery roles and contract version",
  },
});

const requiredRoles = [ColonyRole.Root];

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { version },
  enabledExtensionData,
}: ActionDialogProps) => {
  const {
    userHasPermission,
    canCreateMotion,
    disabledSubmit,
    disabledInput,
    hasLegacyRecoveryRole,
    isLoadingLegacyRecoveryRole,
  } = useNetworkContractUpgradeDialogStatus(colony, requiredRoles, enabledExtensionData);
  const { colonyContractVersion, loadingColonyContractVersion } = useColonyContractVersion();

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {(isLoadingLegacyRecoveryRole || loadingColonyContractVersion) && (
        <DialogSection>
          <MiniSpinnerLoader className={styles.loadingInfo} loadingText={MSG.loadingData} />
        </DialogSection>
      )}
      {hasLegacyRecoveryRole && (
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
        <ContractVersionSection
          colony={colony}
          currentVersion={version}
          colonyContractVersion={colonyContractVersion}
        />
      </DialogSection>
      <DialogSection>
        <Annotations label={MSG.annotation} name="annotation" disabled={disabledInput} />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {/* {onlyForceAction && <NotEnoughReputation />} */}
      {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          disabled={disabledSubmit}
          dataTest="confirmButton"
          onSecondaryButtonClick={back}
          isLoading={isLoadingLegacyRecoveryRole || loadingColonyContractVersion}
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
