import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { ColonyRole, Id } from '@colony/colony-js';
import { useFormContext } from 'react-hook-form';

import AvatarUploader from '~shared/AvatarUploader';
import {
  ActionDialogProps,
  DialogControls,
  DialogHeading,
  DialogSection,
} from '~shared/Dialog';
import {
  Annotations,
  HookFormInput as Input,
  InputStatus,
} from '~shared/Fields';
import ColonyAvatar from '~shared/ColonyAvatar';
// import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import Avatar from '~shared/Avatar';
import { useActionDialogStatus } from '~hooks';

import {
  CannotCreateMotionMessage,
  NoPermissionMessage,
  PermissionRequiredInfo,
} from '../Messages';

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
    defaultMessage: 'Permitted format: .png or .svg',
  },
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you’re editing the colony's details (optional)`,
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

const requiredRoles = [ColonyRole.Root];

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, metadata },
  enabledExtensionData,
}: ActionDialogProps) => {
  const { setValue, getValues } = useFormContext();
  const { colonyAvatarImage, colonyDisplayName } = getValues();
  const [showUploadedAvatar, setShowUploadedAvatar] = useState(false);
  const [avatarFileError, setAvatarFileError] = useState(false);

  const { userHasPermission, canCreateMotion, disabledInput, disabledSubmit } =
    useActionDialogStatus(
      colony,
      requiredRoles,
      [Id.RootDomain],
      enabledExtensionData,
    );

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
      setValue('colonyAvatarImage', String(base64image), { shouldDirty: true });
      setShowUploadedAvatar(true);
      return String(base64image);
    }
    return '';
  };

  const handleFileRemove = async () => {
    setValue('colonyAvatarImage', null, { shouldDirty: true });
    setShowUploadedAvatar(true);
  };

  /*
   * This helps us hook into the internal file uplaoder error state,
   * so that we can invalidate the form if the uploaded file format is incorrect
   */
  const handleFileReadError = async () => {
    setAvatarFileError(true);
  };

  const hasEditedColony =
    metadata?.displayName !== colonyDisplayName ||
    metadata?.avatar !== colonyAvatarImage;

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
        <AvatarUploader
          avatar={showUploadedAvatar ? colonyAvatarImage : metadata?.avatar}
          disabled={disabledInput}
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
                <Avatar
                  avatar={colonyAvatarImage}
                  seed={colonyAddress.toLowerCase()}
                  title={metadata?.displayName || colony.name || colonyAddress}
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
          disabled={disabledInput}
          maxLength={20}
          value={colonyDisplayName}
        />
      </DialogSection>
      <DialogSection>
        <Annotations
          label={MSG.annotation}
          name="annotationMessage"
          disabled={disabledInput}
        />
      </DialogSection>
      {!userHasPermission && (
        <DialogSection>
          <NoPermissionMessage requiredPermissions={requiredRoles} />
        </DialogSection>
      )}
      {/* {onlyForceAction && (
        <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
      )} */}
      {!canCreateMotion && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <CannotCreateMotionMessage />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <DialogControls
          disabled={disabledSubmit || avatarFileError || !hasEditedColony}
          dataTest="confirmButton"
          onSecondaryButtonClick={back}
        />
      </DialogSection>
    </>
  );
};

EditColonyDetailsDialogForm.displayName = displayName;

export default EditColonyDetailsDialogForm;
