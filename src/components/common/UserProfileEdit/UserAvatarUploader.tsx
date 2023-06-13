import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { FileRejection } from 'react-dropzone';

import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';
import { Heading3 } from '~shared/Heading';
import { User } from '~types';
import { FileReaderFile } from '~utils/fileReader/types';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';

import styles from './UserAvatarUploader.css';

const displayName = 'common.UserProfileEdit.UserAvatarUploader';

const MSG = defineMessages({
  heading: {
    id: `${displayName}.heading`,
    defaultMessage: 'Profile Picture',
  },
});

interface Props {
  /** Current user */
  user: User;
}

const UserAvatarUploader = ({
  user,
  user: { walletAddress, profile },
}: Props) => {
  const { updateUser } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<DropzoneErrors>();
  const [updateAvatar] = useUpdateUserProfileMutation();

  const handleFileUpload = async (avatarFile: FileReaderFile | null) => {
    if (avatarFile) {
      setError(undefined);
      setLoading(true);
    }

    try {
      const updatedAvatar = await getOptimisedAvatarUnder300KB(
        avatarFile?.file,
      );
      const thumbnail = await getOptimisedThumbnail(avatarFile?.file);

      await updateAvatar({
        variables: {
          input: {
            id: walletAddress,
            avatar: updatedAvatar,
            thumbnail,
          },
        },
      });

      await updateUser?.(user.walletAddress, true);
    } catch (e) {
      if (e.message.includes('exceeded the maximum')) {
        setError(DropzoneErrors.TOO_LARGE);
      } else {
        setError(DropzoneErrors.DEFAULT);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileRemove = async () => {
    await handleFileUpload(null);
    setError(undefined);
  };

  const handleFileReject = (rejectedFiles: FileRejection[]) => {
    // Only care about first error
    const fileError = getFileRejectionErrors(rejectedFiles)[0][0];
    setError(fileError.code as DropzoneErrors); // these errors come from dropzone
  };

  return (
    <div className={styles.main}>
      <Heading3 appearance={{ theme: 'dark' }} text={MSG.heading} />
      <AvatarUploader
        disableRemove={!profile?.avatar}
        avatarPlaceholder={
          <UserAvatar user={user} size="xl" preferThumbnail={false} />
        }
        handleFileAccept={handleFileUpload}
        handleFileRemove={handleFileRemove}
        handleFileReject={handleFileReject}
        isLoading={loading}
        errorCode={error}
      />
    </div>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
