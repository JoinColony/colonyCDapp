import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';

import { User } from '~types';
import { useUpdateUserProfileMutation } from '~gql';
import { FileReaderFile } from '~utils/fileReader/types';

const displayName = 'common.UserProfileEdit.UserAvatarUploader';

const MSG = defineMessages({
  uploaderLabel: {
    id: `${displayName}.uploaderLabel`,
    defaultMessage: 'At least 250x250px, up to 1MB, .png or .svg',
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
  const [avatar, setAvatar] = useState<string | null>(profile?.avatar || null);
  const [updateAvatar, { error }] = useUpdateUserProfileMutation();
  const updatedUser = {
    ...user,
    // use avatar held in component state
    profile: { ...user.profile, avatar },
  };

  const handleUpload = async (fileData: FileReaderFile) => {
    const file = await updateAvatar({
      variables: {
        input: {
          id: walletAddress,
          avatar: fileData.data,
        },
      },
    });
    setAvatar(fileData.data);
    return file;
  };

  const remove = async () => {
    await updateAvatar({
      variables: {
        input: { id: walletAddress, avatar: null },
      },
    });
    setAvatar(null);
  };

  return (
    <AvatarUploader
      label={MSG.uploaderLabel}
      hasButtons
      renderPlaceholder={
        <UserAvatar
          address={user.walletAddress}
          user={updatedUser}
          size="xl"
          notSet={false}
          preferThumbnail={false}
        />
      }
      upload={handleUpload}
      remove={remove}
      isSet={!!avatar}
      uploadError={error}
    />
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
