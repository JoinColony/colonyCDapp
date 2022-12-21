import React from 'react';
import { defineMessages } from 'react-intl';

import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { getThumbnail } from '~images/optimisation';
import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';
import { User } from '~types';
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
  const { updateUser } = useAppContext();
  const [updateAvatar, { error: uploadError }] = useUpdateUserProfileMutation();

  const handleFileUpload = async (avatarFile: FileReaderFile | null) => {
    const updatedAvatar = avatarFile?.data ?? null;
    const thumbnail = await getThumbnail(avatarFile?.file);

    await updateAvatar({
      variables: {
        input: {
          id: walletAddress,
          avatar: updatedAvatar,
          thumbnail,
        },
      },
    });

    updateUser?.(user.walletAddress);
  };

  const handleFileRemove = () => handleFileUpload(null);

  return (
    <div>
      <AvatarUploader
        label={MSG.uploaderLabel}
        avatar={
          <UserAvatar
            address={walletAddress}
            user={user}
            size="xl"
            preferThumbnail={false}
          />
        }
        handleFileAccept={handleFileUpload}
        handleFileRemove={handleFileRemove}
        isSet={!!profile?.avatar}
        uploadError={uploadError}
      />
    </div>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
