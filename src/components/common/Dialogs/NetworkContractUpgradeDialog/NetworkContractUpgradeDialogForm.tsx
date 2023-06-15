import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { ColonyRole } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import { SetStateFn } from '~types';
import { useColonyContractVersion } from '~hooks';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import { Annotations } from '~shared/Fields';
import { MiniSpinnerLoader } from '~shared/Preloaders';

import {
  CannotCreateMotionMessage,
  NoPermissionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../Messages';

import LegacyPermissionWarning from './LegacyPermissionWarning';
import ContractVersionSection from './ContractVersionSection';
import { useNetworkContractUpgradeDialogStatus } from './helpers';

import styles from './NetworkContractUpgradeDialogForm.css';

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
    defaultMessage: "Loading the colony's recovery roles and contract version",
  },
});

const requiredRoles = [ColonyRole.Root];

interface Props extends ActionDialogProps {
  handleIsForceChange: SetStateFn;
  isForce: boolean;
}

const NetworkContractUpgradeDialogForm = ({
  back,
  colony,
  colony: { version },
  enabledExtensionData,
  handleIsForceChange,
  isForce,
}: Props) => {
  const { watch } = useFormContext();
  const forceAction = watch('forceAction');
  const {
    userHasPermission,
    canCreateMotion,
    disabledSubmit,
    disabledInput,
    hasLegacyRecoveryRole,
    isLoadingLegacyRecoveryRole,
    canOnlyForceAction,
  } = useNetworkContractUpgradeDialogStatus(
    colony,
    requiredRoles,
    enabledExtensionData,
  );
  const { colonyContractVersion, loadingColonyContractVersion } =
    useColonyContractVersion();

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
          isRootMotion
        />
      </DialogSection>
      {(isLoadingLegacyRecoveryRole || loadingColonyContractVersion) && (
        <DialogSection>
          <MiniSpinnerLoader
            className={styles.loadingInfo}
            loadingText={MSG.loadingData}
          />
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
        <Annotations
          label={MSG.annotation}
          name="annotation"
          disabled={disabledInput}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {canOnlyForceAction && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation />
        </DialogSection>
      )}
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
          isLoading={
            isLoadingLegacyRecoveryRole || loadingColonyContractVersion
          }
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

export default NetworkContractUpgradeDialogForm;
