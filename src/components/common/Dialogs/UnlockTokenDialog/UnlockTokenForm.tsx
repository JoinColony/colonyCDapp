import { ColonyRole } from '@colony/colony-js';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TOKEN_UNLOCK_INFO } from '~constants/externalUrls';
import {
  DialogSection,
  ActionDialogProps,
  DialogHeading,
  DialogControls,
} from '~shared/Dialog';
import ExternalLink from '~shared/ExternalLink';
import { Annotations } from '~shared/Fields';
import { SetStateFn } from '~types';

import {
  NoPermissionMessage,
  CannotCreateMotionMessage,
  PermissionRequiredInfo,
  NotEnoughReputation,
} from '../Messages';

import { useUnlockTokenDialogStatus } from './helpers';

import styles from './UnlockTokenForm.css';

const displayName = 'common.UnlockTokenDialog.UnlockTokenForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.dialogTitle`,
    defaultMessage: 'Unlock Token',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `Your colony's native token is locked and non-transferrable
     by default. This action allows you to unlock it so that it may be
     freely transferred between accounts.`,
  },
  note: {
    id: `${displayName}.note`,
    defaultMessage:
      'Please note: this action is irreversible. Use with caution',
  },
  unlockedDescription: {
    id: `${displayName}.unlockedDescription`,
    defaultMessage: `Your colony's native token has already been unlocked.`,
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: "Explain why you're unlocking the native token (optional)",
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

interface Props extends ActionDialogProps {
  handleIsForceChange: SetStateFn;
  isForce: boolean;
}

const UnlockTokenForm = ({
  colony,
  back,
  enabledExtensionData,
  handleIsForceChange,
  isForce,
}: Props) => {
  const { watch } = useFormContext();
  const { forceAction } = watch();

  const {
    userHasPermission,
    disabledInput,
    disabledSubmit,
    showPermissionErrors,
    hasMotionCompatibleVersion,
    isNativeTokenUnlocked,
    canOnlyForceAction,
  } = useUnlockTokenDialogStatus(colony, requiredRoles, enabledExtensionData);

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
      {showPermissionErrors && !isNativeTokenUnlocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.wrapper}>
            <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {!isNativeTokenUnlocked ? (
          <FormattedMessage {...MSG.description} />
        ) : (
          <div className={styles.unlocked}>
            <FormattedMessage {...MSG.unlockedDescription} />
          </div>
        )}
      </DialogSection>
      {!isNativeTokenUnlocked && (
        <>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.note}>
              <FormattedMessage {...MSG.note} />
              <ExternalLink
                className={styles.learnMoreLink}
                text={{ id: 'text.learnMore' }}
                href={TOKEN_UNLOCK_INFO}
              />
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <Annotations
              label={MSG.annotation}
              name="annotationMessage"
              disabled={disabledInput}
              dataTest="unlockTokenAnnotation"
            />
          </DialogSection>
        </>
      )}
      {showPermissionErrors && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {canOnlyForceAction && !isNativeTokenUnlocked && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation includeForceCopy={userHasPermission} />
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
          dataTest="unlockTokenConfirmButton"
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName =
  'common.ColonyHome.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
