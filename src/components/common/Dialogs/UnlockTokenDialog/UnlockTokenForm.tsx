import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ColonyRole,
  Id,
  // VotingReputationVersion,
} from '@colony/colony-js';

import ExternalLink from '~shared/ExternalLink';
import {
  DialogSection,
  ActionDialogProps,
  DialogHeading,
  DialogControls,
} from '~shared/Dialog';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import NoPermissionMessage from '~shared/NoPermissionMessage';
import { Annotations } from '~shared/Fields';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';

import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions

import { TOKEN_UNLOCK_INFO } from '~constants/externalUrls';

import styles from './UnlockTokenForm.css';

const displayName = 'common.UnlockTokenDialog.UnlockTokenForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.dialogTitle`,
    defaultMessage: 'Unlock Token',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `Your colony’s native token is locked and non-transferrable
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
    defaultMessage: `Your colony’s native token has already been unlocked.`,
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

const UnlockTokenForm = ({ colony, back }: ActionDialogProps) => {
  const { wallet } = useAppContext();
  const {
    formState: { isValid },
  } = useFormContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);
  // const isNativeTokenLocked = !!colony?.nativeToken?.unlocked;
  const hasRootPermission = hasRoot(allUserRoles);
  // const canUserUnlockNativeToken = hasRootPermission && status?.nativeToken?.unlockable && isNativeTokenLocked;
  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

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

  const inputDisabled = !userHasPermission || onlyForceAction; // || isNativeTokenLocked;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
  //   !values.forceAction;

  return (
    <>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <DialogHeading title={MSG.title} />
      </DialogSection>
      {!userHasPermission && ( // && isNativeTokenLocked
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.wrapper}>
            <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
          </div>
        </DialogSection>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        {true ? ( // isNativeTokenLocked
          <FormattedMessage {...MSG.description} />
        ) : (
          <div className={styles.unlocked}>
            <FormattedMessage {...MSG.unlockedDescription} />
          </div>
        )}
      </DialogSection>
      {true && ( // isNativeTokenLocked
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
              disabled={inputDisabled}
              dataTest="unlockTokenAnnotation"
            />
          </DialogSection>
        </>
      )}
      {!hasRootPermission && ( // || isVotingExtensionEnabled && isNativeTokenLocked &&
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NoPermissionMessage requiredPermissions={[ColonyRole.Root]} />
        </DialogSection>
      )}
      {/* {onlyForceAction && isNativeTokenLocked && <NotEnoughReputation />}
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
          onSecondaryButtonClick={back}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          dataTest="unlockTokenConfirmButton"
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName =
  'common.ColonyHome.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
