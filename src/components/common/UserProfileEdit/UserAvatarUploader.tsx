import React from 'react';
import { defineMessages } from 'react-intl';

import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';

import { User } from '~types';
import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { excludeTypenameKey } from '~utils/objects';
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
  const userProfile = excludeTypenameKey(profile);
  const { updateUser } = useAppContext();
  const [updateAvatar, { error }] = useUpdateUserProfileMutation();

  const handleUpload = async (fileData: FileReaderFile) => {
    const file = await updateAvatar({
      variables: {
        input: {
          id: walletAddress,
          ...userProfile,
          avatar: fileData.data,
        },
      },
    });
    updateUser?.(user.walletAddress);
    return file;
  };

  const remove = async () => {
    await updateAvatar({
      variables: {
        input: { id: walletAddress, ...userProfile, avatar: null },
      },
    });
    updateUser?.(user.walletAddress);
  };

  return (
    <AvatarUploader
      label={MSG.uploaderLabel}
      hasButtons
      renderPlaceholder={
        <UserAvatar
          address={user.walletAddress}
          user={user}
          size="xl"
          notSet={false}
          preferThumbnail={false}
        />
      }
      upload={handleUpload}
      remove={remove}
      isSet={!!user.profile?.avatar}
      uploadError={error}
    />
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
