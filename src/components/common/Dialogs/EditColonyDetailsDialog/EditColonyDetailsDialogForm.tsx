import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import {
  ColonyRole,
  // VotingReputationVersion,
} from '@colony/colony-js';
import { FormState, UseFormSetValue } from 'react-hook-form';

import AvatarUploader from '~shared/AvatarUploader';
import Button from '~shared/Button';
import { ActionDialogProps } from '~shared/Dialog';
import DialogSection from '~shared/Dialog/DialogSection';
import {
  Annotations,
  HookFormInput as Input,
  InputStatus,
} from '~shared/Fields'; // ForceToggle
import { Heading3 } from '~shared/Heading';
import PermissionsLabel from '~shared/PermissionsLabel';
import PermissionRequiredInfo from '~shared/PermissionRequiredInfo';
import ColonyAvatar from '~shared/ColonyAvatar';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
// import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import {
  useTransformer,
  useDialogActionPermissions,
  useAppContext,
} from '~hooks'; // useEnabledExtensions
import { getAllUserRoles } from '~redux/transformers';
import { hasRoot } from '~utils/checks';

import { FormValues } from './EditColonyDetailsDialog';

import styles from './EditColonyDetailsDialogForm.css';

const displayName =
  'common.EditColonyDetailsDialog.EditColonyDetailsDialogForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Edit colony details',
  },
  name: {
    id: `${displayName}.name`,
    defaultMessage: 'Colony name',
  },
  logo: {
    id: `${displayName}.logo`,
    defaultMessage: 'Colony Logo (Optional)',
  },
  permittedFormat: {
    id: `${displayName}.permittedFormat`,
    defaultMessage:
      'Permitted format: .png or .svg (at least 250px, up to 1 MB)',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you’re editing the colony's details (optional)`,
  },
  noPermission: {
    id: `${displayName}.noPermission`,
    defaultMessage: `You do not have the {roleRequired} permission required
      to take this action.`,
  },
  invalidAvatarFormat: {
    id: `${displayName}.invalidAvatarFormat`,
    defaultMessage: `Image you tried to upload is in an invalid format`,
  },
  cannotCreateMotion: {
    id: `${displayName}.cannotCreateMotion`,
    defaultMessage: `Cannot create motions using the Governance v{version} Extension. Please upgrade to a newer version (when available)`,
  },
});

interface Props extends ActionDialogProps {
  values: FormValues;
  setValue: UseFormSetValue<FormValues>;
}

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, profile },
  isSubmitting,
  isValid,
  values: { colonyAvatarImage, colonyDisplayName, forceAction },
  setValue,
}: Props & FormState<FormValues>) => {
  const [showUploadedAvatar, setShowUploadedAvatar] = useState(false);
  const [avatarFileError, setAvatarFileError] = useState(false);
  const { user } = useAppContext();
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    user?.walletAddress,
  ]);

  const hasRegisteredProfile = !!user?.name && !!user.walletAddress;
  const canEdit = hasRegisteredProfile && hasRoot(allUserRoles);

  // const {
  //   votingExtensionVersion,
  //   isVotingExtensionEnabled,
  // } = useEnabledExtensions({
  //   colonyAddress,
  // });

  const [userHasPermission, onlyForceAction] = useDialogActionPermissions(
    colony.colonyAddress,
    canEdit,
    false, // isVotingExtensionEnabled,
    forceAction,
  );

  const inputDisabled = !userHasPermission || onlyForceAction || isSubmitting;

  /*
   * Note that these threee methods just read the file locally, they don't actually
   * upload it anywere.
   *
   * The upload method returns the file as a base64 string, which, after we submit
   * the form we will be uploading to IPFS
   */
  const handleFileRead = async (file) => {
    if (file) {
      const base64image = file.data;
      setValue('colonyAvatarImage', String(base64image));
      setShowUploadedAvatar(true);
      return String(base64image);
    }
    return '';
  };

  const handleFileRemove = async () => {
    setValue('colonyAvatarImage', null);
    setShowUploadedAvatar(true);
  };

  /*
   * This helps us hook into the internal file uplaoder error state,
   * so that we can invalidate the form if the uploaded file format is incorrect
   */
  const handleFileReadError = async () => {
    setAvatarFileError(true);
  };

  const canValuesBeUpdate =
    /*
     * If the newly set name is different from the existing one
     */
    displayName !== colonyDisplayName ||
    /*
     * If the newly set image is differnet from the existing one but only if
     * - it's a truthy (default form value)
     * - it's not null (it has been specifically removed by the user)
     */
    ((!!colonyAvatarImage || colonyAvatarImage === null) &&
      profile?.thumbnail !== colonyAvatarImage);

  // const cannotCreateMotion =
  //   votingExtensionVersion ===
  //     VotingReputationExtensionVersion.FuchsiaLightweightSpaceship &&
  //   !forceAction;

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
            {/* {canEdit && isVotingExtensionEnabled && (
              <ForceToggle disabled={isSubmitting} />
            )} */}
          </div>
        </div>
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <PermissionRequiredInfo requiredRoles={[ColonyRole.Root]} />
        </DialogSection>
      )}
      <DialogSection>
        <AvatarUploader
          avatar={profile?.avatar}
          disabled={inputDisabled}
          label={MSG.logo}
          handleFileAccept={handleFileRead}
          handleFileRemove={handleFileRemove}
          avatarPlaceholder={
            <>
              {showUploadedAvatar ? (
                /*
                 * If we have a currently uploaded avatar, **or** if we just remove it
                 * show the default colony avatar, without values coming from the
                 * colony.
                 *
                 * Note that in case of the avatar being removed, `avatarURL` will be
                 * passed as `undefined` so that the blockies show.
                 * This is intended functionality
                 */
                <ColonyAvatar
                  colonyAddress={colonyAddress}
                  avatar={colonyAvatarImage}
                  size="xl"
                />
              ) : (
                /*
                 * Show the colony hooked avatar. This is only visible until the
                 * user interacts with avatar input for the first time
                 */
                <ColonyAvatar
                  colony={colony}
                  colonyAddress={colonyAddress}
                  size="xl"
                />
              )}
            </>
          }
          handleFileReject={handleFileReadError}
        />
        {avatarFileError && (
          <div className={styles.avatarUploadError}>
            <InputStatus error={MSG.invalidAvatarFormat} />
          </div>
        )}
        <p className={styles.smallText}>
          <FormattedMessage {...MSG.permittedFormat} />
        </p>
      </DialogSection>
      <DialogSection>
        <Input
          label={MSG.name}
          name="colonyDisplayName"
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          disabled={inputDisabled}
          maxLength={20}
          value={colonyDisplayName}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={inputDisabled}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
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
            forceAction || true // || !isVotingExtensionEnabled
              ? { id: 'button.confirm' }
              : { id: 'button.createMotion' }
          }
          loading={isSubmitting}
          disabled={
            // cannotCreateMotion ||
            inputDisabled ||
            !isValid ||
            avatarFileError ||
            !canValuesBeUpdate ||
            isSubmitting
          }
          style={{ minWidth: styles.wideButton }}
          data-test="confirmButton"
        />
      </DialogSection>
    </>
  );
};

EditColonyDetailsDialogForm.displayName = displayName;

export default EditColonyDetailsDialogForm;
