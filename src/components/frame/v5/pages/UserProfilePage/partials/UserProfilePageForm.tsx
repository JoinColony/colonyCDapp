import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import Toast from '~shared/Extensions/Toast';
import Input from '~v5/common/Fields/Input';
import Textarea from '~v5/common/Fields/Textarea';
import Button from '~v5/shared/Button';
import AvatarUploader from '~v5/common/AvatarUploader';
import Avatar from '~v5/shared/Avatar';
import { formatText } from '~utils/intl';
import {
  UseAvatarUploaderProps,
  useGetUploaderText,
} from '~v5/common/AvatarUploader/hooks';
import { useAppContext, useMobile } from '~hooks';
import { UserFragment, useUpdateUserProfileMutation } from '~gql';

import styles from '../UserProfilePage.module.css';
import { MAX_BIO_CHARS, MAX_DISPLAYNAME_CHARS } from '../consts';

import LeftColumn from './LeftColumn';
import { profileFileOptions } from './consts';
import IconSuccessContent from './IconSuccessContent';

const displayName = 'v5.pages.UserProfilePage';

interface Props {
  user: UserFragment | null | undefined;
  avatarUrl: string | null | undefined;
  canChangeUsername: boolean;
  daysTillUsernameChange: number;
}

const UserProfilePageForm = ({
  user,
  avatarUrl,
  canChangeUsername,
  daysTillUsernameChange,
}: Props) => {
  const {
    formState: { dirtyFields, errors },
    register,
    setValue,
    getValues,
    reset,
  } = useFormContext();
  const { updateUser, wallet } = useAppContext();
  const [updateAvatar] = useUpdateUserProfileMutation();
  const isMobile = useMobile();
  const { displayName: displayNameDirty } = dirtyFields;
  const showNameMessage = displayNameDirty && !errors.displayName?.message;

  useEffect(() => {
    reset({
      hasDisplayNameChanged: false,
      bio: user?.profile?.bio || '',
      displayName: user?.profile?.displayName || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
    });
  }, [user, reset]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const axiosUpload: UseAvatarUploaderProps['updateFn'] = async (
    _,
    thumbnail,
    setProgress,
  ) => {
    axios.post(
      '',
      {
        variables: {
          input: {
            // @ts-ignore
            id: user?.walletAddress,
            thumbnail,
          },
        },
      },
      {
        onUploadProgress: ({ loaded, total = 0 }) => {
          setProgress(Math.floor((loaded / total) * 100));
        },
      },
    );
  };

  const updateAvatarFn: UseAvatarUploaderProps['updateFn'] = async (
    avatar,
    thumbnail,
    setProgress,
  ) => {
    const formData = new FormData();
    formData.append('file', avatar || '');
    setProgress(0);

    /* Axios upload currently has no destination */
    /* axiosUpload(avatar, thumbnail, setProgress); */

    await updateAvatar({
      variables: {
        input: {
          // @ts-ignore
          id: user?.walletAddress,
          avatar,
          thumbnail,
        },
      },
    });

    await updateUser(user?.walletAddress, true);

    toast.success(
      <Toast
        type="success"
        title={{ id: 'upload.avatar.successfully.toast.title' }}
        description={{
          id: 'upload.avatar.successfully.toast.description',
        }}
      />,
    );

    if (avatar === null) {
      setProgress(0);
    } else {
      /* Needed in order to signal the upload was successful */
      setProgress(100);
    }
  };

  /*
   * Imperatively update the hasDisplayNameChanged form field, in order to be able to conditionally
   * validate the displayName field. We don't want it to be validated if it hasn't changed.
   */
  const hasDisplayNameChanged = getValues('hasDisplayNameChanged');

  if (displayNameDirty && !hasDisplayNameChanged) {
    setValue('hasDisplayNameChanged', true, {
      shouldValidate: false,
    });
  } else if (!displayNameDirty && hasDisplayNameChanged) {
    setValue('hasDisplayNameChanged', false, {
      shouldValidate: false,
    });
  }

  const uploaderText = useGetUploaderText(profileFileOptions);

  return (
    <div className="flex flex-col gap-6">
      <h4 className="heading-4 mb-6">{formatText({ id: 'profile.page' })}</h4>
      <div className={`${styles.row} mb-3`}>
        <LeftColumn
          fieldTitle={{ id: 'field.username' }}
          fieldDescription={{ id: 'description.username' }}
        />
        <div
          className={clsx('w-full', {
            'mb-6': showNameMessage,
          })}
        >
          <Input
            maxCharNumber={MAX_DISPLAYNAME_CHARS}
            shouldNumberOfCharsBeVisible
            name="displayName"
            isDisabled={!canChangeUsername}
            register={register}
            isError={!!errors.displayName?.message}
            customErrorMessage={
              errors.displayName?.message as string | undefined
            }
            successfulMessage={
              showNameMessage
                ? formatText({
                    id: 'success.userName',
                  })
                : undefined
            }
            isDecoratedError={errors.displayName?.type === 'isUsernameTaken'}
            disabledTooltipMessage={formatText(
              { id: 'displayName.input.disabled' },
              { days: daysTillUsernameChange },
            )}
          />
        </div>
      </div>
      <div className={styles.row}>
        <LeftColumn
          fieldTitle={{ id: 'field.avatar' }}
          fieldDescription={{ id: 'description.avatar' }}
        />
        <div className="w-full">
          <AvatarUploader
            avatarPlaceholder={
              <Avatar
                size="xm"
                avatar={avatarUrl}
                seed={wallet?.address.toLowerCase()}
              />
            }
            fileOptions={profileFileOptions}
            updateFn={updateAvatarFn}
            uploaderText={uploaderText}
            SuccessComponent={IconSuccessContent}
          />
        </div>
      </div>

      <span className="divider" />

      <div className={styles.row}>
        <LeftColumn
          fieldTitle={{ id: 'field.website' }}
          fieldDescription={{ id: 'description.website' }}
        />
        <div className="w-full">
          <Input
            name="website"
            register={register}
            isError={!!errors.website?.message}
            customErrorMessage={errors.website?.message as string | undefined}
          />
        </div>
      </div>

      <span className="divider" />

      <div className={styles.row}>
        <LeftColumn
          fieldTitle={{ id: 'field.bio' }}
          fieldDescription={{ id: 'description.bio' }}
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

      <span className="divider" />

      <div className={styles.row}>
        <LeftColumn
          fieldTitle={{ id: 'field.location' }}
          fieldDescription={{ id: 'description.location' }}
        />
        <div className="w-full">
          <Input name="location" register={register} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" isFullSize={isMobile} mode="primarySolid">
          {formatText({ id: 'button.saveUserProfile' })}
        </Button>
      </div>
    </div>
  );
};

UserProfilePageForm.displayName = displayName;

export default UserProfilePageForm;
