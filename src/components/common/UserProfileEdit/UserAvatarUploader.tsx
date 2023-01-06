import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import {
  getOptimisedAvatar,
  getOptimisedThumbnail,
} from '~images/optimisation';
import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';
import { Heading3 } from '~shared/Heading';
import { User } from '~types';
import { FileReaderFile } from '~utils/fileReader/types';

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
  const [hasError, setHasError] = useState<boolean>(false);
  const [updateAvatar] = useUpdateUserProfileMutation({
    onError: () => {
      setHasError(true);
    },
  });

  const handleFileUpload = async (avatarFile: FileReaderFile | null) => {
    if (avatarFile) {
      setHasError(false);
      setLoading(true);
    }
    const updatedAvatar = await getOptimisedAvatar(avatarFile?.file);
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
    setLoading(false);
  };

  const handleFileRemove = async () => {
    await handleFileUpload(null);
    setHasError(false);
  };

  const handleFileReject = () => {
    setHasError(true);
  };

  return (
    <div className={styles.main}>
      <Heading3 appearance={{ theme: 'dark' }} text={MSG.heading} />
      <AvatarUploader
        avatar={profile?.avatar}
        avatarPlaceholder={
          <UserAvatar
            address={walletAddress}
            user={user}
            size="xl"
            preferThumbnail={false}
          />
        }
        handleFileAccept={handleFileUpload}
        handleFileRemove={handleFileRemove}
        handleFileReject={handleFileReject}
        isLoading={loading}
        hasError={hasError}
      />
    </div>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
