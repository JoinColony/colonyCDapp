import React from 'react';
import { FileRejection } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import {
  getOptimisedAvatar,
  getOptimisedThumbnail,
} from '~images/optimisation';
import Avatar from '~shared/Avatar';
import AvatarUploader from '~shared/AvatarUploader';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { Colony, SetStateFn } from '~types';
import { FileReaderFile } from '~utils/fileReader/types';

const displayName =
  'common.EditColonyDetailsDialog.EditColonyDetailsDialogForm.ColonyAvatarUploader';

const MSG = defineMessages({
  logo: {
    id: `${displayName}.logo`,
    defaultMessage: 'Colony Logo (Optional)',
  },
});

interface ColonyAvatarUploaderProps {
  avatarFileError?: DropzoneErrors;
  setAvatarFileError: SetStateFn;
  disabledInput: boolean;
  colony: Colony;
}

const ColonyAvatarUploader = ({
  avatarFileError,
  setAvatarFileError,
  disabledInput,
  colony: { colonyAddress, metadata, name: colonyName },
}: ColonyAvatarUploaderProps) => {
  const { setValue, watch } = useFormContext();
  const { colonyAvatarImage } = watch();

  const handleFileRemove = async () => {
    setValue('colonyAvatarImage', null, { shouldDirty: true });
    setValue('colonyThumbnail', null);
    setAvatarFileError(undefined);
  };

  const handleFileRead = async (file: FileReaderFile) => {
    if (!file) {
      return;
    }

    setAvatarFileError(undefined);

    try {
      const optimisedImage = await getOptimisedAvatar(file.file);
      const optimisedThumbnail = await getOptimisedThumbnail(file.file);
      setValue('colonyAvatarImage', optimisedImage, { shouldDirty: true });
      setValue('colonyThumbnail', optimisedThumbnail);
    } catch (e) {
      setAvatarFileError(DropzoneErrors.DEFAULT);
    }
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    // Only care about first error
    const fileError = getFileRejectionErrors(rejectedFiles)[0][0];
    setAvatarFileError(fileError.code as DropzoneErrors); // these errors come from dropzone
  };

  return (
    <AvatarUploader
      disabled={disabledInput}
      disableRemove={!colonyAvatarImage}
      label={MSG.logo}
      handleFileAccept={handleFileRead}
      handleFileRemove={handleFileRemove}
      handleFileReject={handleFileReject}
      errorCode={avatarFileError}
      avatarPlaceholder={
        <Avatar
          avatar={colonyAvatarImage}
          seed={colonyAddress.toLowerCase()}
          title={metadata?.displayName || colonyName || colonyAddress}
          size="xl"
        />
      }
    />
  );
};

ColonyAvatarUploader.displayName = displayName;

export default ColonyAvatarUploader;
