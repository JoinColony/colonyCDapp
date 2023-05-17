import React, { useEffect, useState } from 'react';
import { defineMessages } from 'react-intl';
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
import Avatar from '~shared/Avatar';
import { useActionDialogStatus } from '~hooks';
import {
  getOptimisedAvatar,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { FileReaderFile } from '~utils/fileReader/types';
import { SetStateFn } from '~types';

import {
  CannotCreateMotionMessage,
  NoPermissionMessage,
  NotEnoughReputation,
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
  annotation: {
    id: `${displayName}.annotation`,
    defaultMessage: `Explain why you're editing the colony's details (optional)`,
  },
  invalidAvatarFormat: {
    id: `${displayName}.invalidAvatarFormat`,
    defaultMessage: `Image you tried to upload is in an invalid format`,
  },
});

const requiredRoles = [ColonyRole.Root];

interface EditColonyDetailsDialogFormProps extends ActionDialogProps {
  isForce: boolean;
  setIsForce: SetStateFn;
}

const EditColonyDetailsDialogForm = ({
  back,
  colony,
  colony: { colonyAddress, metadata },
  enabledExtensionData,
  isForce,
  setIsForce,
}: EditColonyDetailsDialogFormProps) => {
  const { setValue, watch } = useFormContext();
  const { colonyAvatarImage, colonyDisplayName, forceAction } = watch();
  const [showUploadedAvatar, setShowUploadedAvatar] = useState(false);
  const [avatarFileError, setAvatarFileError] = useState(false);

  useEffect(() => {
    if (forceAction !== isForce) {
      setIsForce(forceAction);
    }
  }, [forceAction, isForce, setIsForce]);

  const {
    userHasPermission,
    canCreateMotion,
    disabledInput,
    disabledSubmit,
    canOnlyForceAction,
  } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  const handleFileRead = async (file: FileReaderFile) => {
    if (!file) {
      return;
    }

    try {
      const optimisedImage = await getOptimisedAvatar(file.file);
      const optimisedThumbnail = await getOptimisedThumbnail(file.file);
      setValue('colonyAvatarImage', optimisedImage, { shouldDirty: true });
      setValue('colonyThumbnail', optimisedThumbnail);
      setShowUploadedAvatar(true);
    } catch (e) {
      setAvatarFileError(true);
    }
  };

  const handleFileRemove = async () => {
    setValue('colonyAvatarImage', null, { shouldDirty: true });
    setValue('colonyThumbnail', null);
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
        <DialogHeading
          title={MSG.title}
          userHasPermission={userHasPermission}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          isRootMotion
          colony={colony}
        />
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
                  preferThumbnail={false}
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
      {canOnlyForceAction && (
        <DialogSection>
          <NotEnoughReputation appearance={{ marginTop: 'negative' }} />
        </DialogSection>
      )}
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
          isVotingReputationEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
        />
      </DialogSection>
    </>
  );
};

EditColonyDetailsDialogForm.displayName = displayName;

export default EditColonyDetailsDialogForm;
