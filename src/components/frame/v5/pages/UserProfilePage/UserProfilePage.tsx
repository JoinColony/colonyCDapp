import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';

import { FileRejection } from 'react-dropzone';
import { useAppContext, useMobile } from '~hooks';
import Input from '~v5/common/Fields/Input';
import Navigation from '~v5/common/Navigation';
import TwoColumns from '~v5/frame/TwoColumns';
import Spinner from '~v5/shared/Spinner';
import LeftColumn from './partials/LeftColumn';
import styles from './UserProfilePage.module.css';
import Textarea from '~v5/common/Fields/Textarea';
import Button from '~v5/shared/Button';
import { useUserProfile } from './hooks';
import { MAX_BIO_CHARS, MAX_DISPLAYNAME_CHARS } from './consts';
import AvatarUploader from './partials/AvatarUploader';
import { useUpdateUserProfileMutation } from '~gql';
import {
  getOptimisedAvatarUnder300KB,
  getOptimisedThumbnail,
} from '~images/optimisation';
import { DropzoneErrors } from '~shared/AvatarUploader/helpers';
import { getFileRejectionErrors } from '~shared/FileUpload/utils';
import UserAvatar from '~shared/UserAvatar';
import { FileReaderFile } from '~utils/fileReader/types';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const isMobile = useMobile();
  const { formatMessage } = useIntl();
  const { register, handleSubmit, onSubmit, errors, user, isFormEdited } =
    useUserProfile();
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
            id: user?.walletAddress,
            avatar: updatedAvatar,
            thumbnail,
          },
        },
      });

      await updateUser?.(user?.walletAddress, true);
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

  // @TODO: when API will be ready add logic to disabling displayName input

  return (
    <Spinner loadingText={{ id: 'loading.userProfilePage' }}>
      <TwoColumns aside={<Navigation pageName="profile" />}>
        <h4 className="heading-4 mb-6">
          {formatMessage({ id: 'profile.page' })}
        </h4>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.username' }}
                fieldDecription={{ id: 'description.username' }}
              />
              <div className="w-full">
                <Input
                  maxCharNumber={MAX_DISPLAYNAME_CHARS}
                  shouldNumberOfCharsBeVisible
                  name="displayName"
                  register={register}
                  isError={!!errors.displayName?.message}
                  customErrorMessage={errors.displayName?.message}
                  customSuccessMessage={formatMessage({
                    id: 'success.userName',
                  })}
                  isErrorPillVisible={
                    errors.displayName?.type === 'isUsernameTaken'
                  }
                  isFormEdited={isFormEdited}
                />
              </div>
            </div>
            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.avatar' }}
                fieldDecription={{ id: 'description.avatar' }}
              />
              <AvatarUploader
                disableRemove={false}
                avatarPlaceholder={
                  <UserAvatar user={null} size="xl" preferThumbnail={false} />
                }
                handleFileAccept={handleFileUpload}
                handleFileRemove={handleFileRemove}
                handleFileReject={handleFileReject}
                isLoading={loading}
                errorCode={error}
              />
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.website' }}
                fieldDecription={{ id: 'description.website' }}
              />
              <div className="w-full">
                <Input
                  name="website"
                  register={register}
                  isError={!!errors.website?.message}
                  customErrorMessage="errors.website.message"
                />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.bio' }}
                fieldDecription={{ id: 'description.bio' }}
              />
              <div className="w-full">
                <Textarea
                  maxCharNumber={MAX_BIO_CHARS}
                  shouldNumberOfCharsBeVisible
                  name="bio"
                  register={register}
                  isError={!!errors.bio?.message}
                />
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className={styles.row}>
              <LeftColumn
                fieldTitle={{ id: 'field.location' }}
                fieldDecription={{ id: 'description.location' }}
              />
              <div className="w-full">
                <Input name="location" register={register} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" isFullSize={isMobile} mode="primarySolid">
                {formatMessage({ id: 'button.save.user.profile' })}
              </Button>
            </div>
          </div>
        </form>
      </TwoColumns>
    </Spinner>
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
