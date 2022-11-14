import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import { useMutation, gql } from '@apollo/client';

import { FileReaderFile } from '~shared/FileUpload';
import { useAppContext, useAsyncFunction } from '~hooks';
import AvatarUploader from '~shared/AvatarUploader';
import UserAvatar from '~shared/UserAvatar';
import { InputStatus } from '~shared/Fields';

import { ActionTypes } from '~redux/index';
import { User } from '~types';
import { updateUser } from '~gql';

import styles from './UserAvatarUploader.css';

const displayName = 'common.UserProfileEdit.UserAvatarUploader';

const MSG = defineMessages({
  uploaderLabel: {
    id: `${displayName}.uploaderLabel`,
    defaultMessage: 'At least 250x250px, up to 1MB, .png or .svg',
  },
  avatarFileError: {
    id: `${displayName}.avatarFileError`,
    defaultMessage: 'This filetype is not allowed or file is too big',
  },
});

interface Props {
  /** Current user */
  user: User;
}

const uploadActions = {
  submit: ActionTypes.USER_AVATAR_UPLOAD,
  success: ActionTypes.USER_AVATAR_UPLOAD_SUCCESS,
  error: ActionTypes.USER_AVATAR_UPLOAD_ERROR,
};

const removeActions = {
  submit: ActionTypes.USER_AVATAR_REMOVE,
  success: ActionTypes.USER_AVATAR_REMOVE_SUCCESS,
  error: ActionTypes.USER_AVATAR_UPLOAD_ERROR,
};

const UserAvatarUploader = ({ user, user: { walletAddress } }: Props) => {
  const { updateWallet } = useAppContext();

  const [updateAvatar, { error, isSet, loading, reset }] = useMutation(
    gql(updateUser),
  );

  const [avatarFileError, setAvatarFileError] = useState(false);

  const handleUpload = (fileData: FileReaderFile) => {
    console.log(
      '🚀 ~ file: UserAvatarUploader.tsx ~ line 55 ~ handleUpload ~ fileData',
      fileData,
    );
    setAvatarFileError(false);
    return updateAvatar({
      variables: {
        input: { id: walletAddress, profile: { avatar: fileData.data } },
      },
    });
  };

  const remove = () =>
    updateAvatar({
      variables: {
        input: { id: walletAddress, profile: { avatar: null } },
      },
    });

  const handleError = async () => {
    setAvatarFileError(true);
  };

  return (
    <>
      <AvatarUploader
        label={MSG.uploaderLabel}
        hasButtons
        placeholder={
          <UserAvatar
            address={user.walletAddress}
            user={user}
            size="xl"
            notSet={false}
          />
        }
        upload={handleUpload}
        remove={remove}
        isSet={user && user.profile && !!user.profile.avatar}
        handleError={handleError}
      />
      {avatarFileError && (
        <div className={styles.inputStatus}>
          <InputStatus error={MSG.avatarFileError} />
        </div>
      )}
    </>
  );
};

UserAvatarUploader.displayName = displayName;

export default UserAvatarUploader;
