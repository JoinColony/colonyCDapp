import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext.tsx';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { uiEvents, UIEvent } from '~uiEvents/index.ts';
import { formatText } from '~utils/intl.ts';
import {
  type UseAvatarUploaderProps,
  useGetUploaderText,
} from '~v5/common/AvatarUploader/hooks.tsx';
import Avatar from '~v5/shared/Avatar/index.ts';

import {
  profileFileOptions,
  MAX_BIO_CHARS,
  MAX_DISPLAYNAME_CHARS,
} from '../consts.ts';
import IconSuccessContent from '../IconSuccessContent.tsx';
import { type RowGroup } from '../Row/types.ts';
import { useUserProfile } from '../UserAccountPage/hooks.tsx';

export const useUserProfilePageForm = () => {
  const { user } = useAppContext();
  const { avatarUrl, canChangeUsername, daysTillUsernameChange } =
    useUserProfile();
  const { formState, register, setValue, getValues, reset } = useFormContext();
  const { updateUser, wallet } = useAppContext();
  const [updateAvatar] = useUpdateUserProfileMutation();
  const displayNameDirty = formState?.dirtyFields.displayName;
  const showNameMessage: boolean =
    displayNameDirty && !formState?.errors.displayName?.message;

  useEffect(() => {
    reset({
      hasDisplayNameChanged: false,
      bio: user?.profile?.bio || '',
      displayName: user?.profile?.displayName || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
    });
  }, [user, reset]);

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

    uiEvents.emit(UIEvent.updateAvatar);

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

  const rowStyles =
    'flex md:items-center gap-6 sm:!gap-[6.5rem] flex-col sm:flex-row w-full';

  const descriptionClassName = 'w-[23.375rem]';

  const columnsList: RowGroup[] = [
    {
      key: '1',
      items: [
        {
          key: '1.1',
          title: formatText({ id: 'field.username' }),
          description: formatText({ id: 'description.username' }),
          className: rowStyles,
          descriptionClassName,
          inputProps: {
            maxCharNumber: MAX_DISPLAYNAME_CHARS,
            shouldNumberOfCharsBeVisible: true,
            name: 'displayName',
            isDisabled: !canChangeUsername,
            register,
            isError: !!formState?.errors.displayName?.message,
            customErrorMessage: formState?.errors.displayName?.message as
              | string
              | undefined,
            successfulMessage: showNameMessage
              ? formatText({
                  id: 'success.userName',
                })
              : undefined,
            isDecoratedError:
              formState?.errors.displayName?.type === 'isUsernameTaken',
            disabledTooltipMessage: formatText(
              { id: 'displayName.input.disabled' },
              { days: daysTillUsernameChange },
            ),
          },
        },
        {
          key: '1.2',
          title: formatText({ id: 'field.avatar' }),
          description: formatText({ id: 'description.avatar' }),
          descriptionClassName,
          avatarUploaderProps: {
            avatarPlaceholder: (
              <Avatar
                size="xm"
                avatar={avatarUrl}
                seed={wallet?.address.toLowerCase()}
              />
            ),
            fileOptions: profileFileOptions,
            updateFn: updateAvatarFn,
            uploaderText,
            SuccessComponent: IconSuccessContent,
          },
        },
      ],
    },
    {
      key: '2',
      title: formatText({ id: 'field.website' }),
      description: formatText({ id: 'description.website' }),
      className: rowStyles,
      descriptionClassName,
      inputProps: {
        name: 'website',
        register,
        isError: !!formState?.errors.website?.message,
        customErrorMessage: formState?.errors.website?.message as
          | string
          | undefined,
      },
    },
    {
      key: '3',
      title: formatText({ id: 'field.bio' }),
      description: formatText({ id: 'description.bio' }),
      className: rowStyles,
      descriptionClassName,
      textAreaProps: {
        maxCharNumber: MAX_BIO_CHARS,
        shouldNumberOfCharsBeVisible: true,
        name: 'bio',
        register,
        isError: !!formState?.errors.bio?.message,
      },
    },
    {
      key: '4',
      title: formatText({ id: 'field.location' }),
      description: formatText({ id: 'description.location' }),
      className: rowStyles,
      descriptionClassName,
      inputProps: {
        name: 'location',
        register,
      },
    },
  ];

  return {
    columnsList,
  };
};
