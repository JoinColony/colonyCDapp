import React from 'react';
import { FormState } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';

import Button from '~shared/Button';
import ExternalLink from '~shared/ExternalLink';
import { DialogSection, ActionDialogProps } from '~shared/Dialog';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
// import ForceToggle from '~shared/Fields/ForceToggle';
import { Annotations } from '~shared/Fields';
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions

import { TOKEN_UNLOCK_INFO } from '~constants/externalUrls';

import { FormValues } from './UnlockTokenDialog';

import styles from './UnlockTokenForm.css';

const displayName = 'common.ColonyHome.UnlockTokenDialog.UnlockTokenForm';

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
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  unlockedTitle: {
    id: `${displayName}.unlockedTitle`,
    defaultMessage: 'Token Unlocked',
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

interface Props extends ActionDialogProps {
  values: FormValues;
}

const UnlockTokenForm = ({
  colony: { status, colonyAddress },
  colony,
  back,
  isSubmitting,
  isValid,
  values,
}: Props & FormState<FormValues>) => {
  const { wallet } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);
  const isNativeTokenLocked = !!status?.nativeToken?.unlocked;
  const hasRootPermission = hasRoot(allUserRoles);
  const canUserUnlockNativeToken = true; // hasRootPermission && status?.nativeToken?.unlockable && isNativeTokenLocked;

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colonyAddress,
    !!canUserUnlockNativeToken,
    false, // isVotingExtensionEnabled,
    values.forceAction,
  );

  const inputDisabled =
    !userHasPermission || onlyForceAction || isNativeTokenLocked;

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationVersion.FuchsiaLightweightSpaceship &&
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
            {/* {canUserUnlockNativeToken && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && isNativeTokenLocked && (
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
      {!hasRootPermission &&
        isNativeTokenLocked && ( // || isVotingExtensionEnabled
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.noPermissionMessage}>
              <FormattedMessage
                {...MSG.noPermission}
                values={{
                  roleRequired: (
                    <PermissionsLabel
                      permission={ColonyRole.Root}
                      name={{
                        id: `role.${ColonyRole.Root}`,
                      }}
                    />
                  ),
                }}
              />
            </div>
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
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={
            values.forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={!isValid || inputDisabled} // cannotCreateMotion ||
          style={{ minWidth: styles.wideButton }}
          data-test="unlockTokenConfirmButton"
        />
      </DialogSection>
    </>
  );
};

UnlockTokenForm.displayName =
  'common.ColonyHome.UnlockTokenDialog.UnlockTokenForm';

export default UnlockTokenForm;
