import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useIntl } from 'react-intl';

import { useAppContext, useCanEditProfile } from '~hooks';
import { GetUserByNameDocument, useUpdateUserProfileMutation } from '~gql';
import { UserProfileFormProps } from './types';
import Toast from '~shared/Extensions/Toast';
import {
  MAX_BIO_CHARS,
  MAX_DISPLAYNAME_CHARS,
  MAX_LOCATION_CHARS,
} from './consts';
import { USERNAME_REGEX } from '~common/CreateUserWizard/validation';
import { createYupTestFromQuery } from '~utils/yup/tests';

const USERNAME_CHANGE_LIMIT = 90; // username can be changed once every 90 days

const calculateUsernameChangePeriod = (displayNameChanged?: string | null) => {
  const date = new Date();
  const fallbackDate = date.setDate(date.getDate() - 90);

  /* eslint-disable camelcase */
  // if there's no displayNameChanged date, we'll let them change their username
  const nameChanged_ms = new Date(displayNameChanged ?? fallbackDate).valueOf();
  const now_ms = new Date().valueOf();
  const daysSinceUsernameChange = Math.floor(
    (now_ms - nameChanged_ms) / (1000 * 60 * 60 * 24),
  );
  /* eslint-enable camelcase */

  const daysTillUsernameChange =
    USERNAME_CHANGE_LIMIT - daysSinceUsernameChange;
  const canChangeUsername = daysTillUsernameChange <= 0;

  return { canChangeUsername, daysTillUsernameChange };
};
export const useUserProfile = () => {
  const { updateUser } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const { user, loadingProfile } = useCanEditProfile();
  const { formatMessage } = useIntl();
  const { profile } = user || {};
  const avatarUrl = profile?.avatar || profile?.thumbnail;

  const isValidUsername = (username: string) => {
    return username ? new RegExp(USERNAME_REGEX).test(username) : false;
  };

  const isUsernameTaken = createYupTestFromQuery({
    query: GetUserByNameDocument,
    circuitBreaker: isValidUsername,
  });

  const validationSchema = yup.object<UserProfileFormProps>({
    displayName: yup
      .string()
      .max(MAX_DISPLAYNAME_CHARS, formatMessage({ id: 'too.many.characters' }))
      .matches(
        USERNAME_REGEX,
        formatMessage({ id: 'error.displayName.valid.message' }),
      )
      .required(formatMessage({ id: 'errors.displayName.message' }))
      .test(
        'isUsernameTaken',
        formatMessage({ id: 'error.usernameTaken' }),
        isUsernameTaken,
      ),
    bio: yup
      .string()
      .max(MAX_BIO_CHARS, formatMessage({ id: 'too.many.characters' })),
    website: yup.string().url(formatMessage({ id: 'errors.website.message' })),
    location: yup
      .string()
      .max(MAX_LOCATION_CHARS, formatMessage({ id: 'too.many.characters' })),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<UserProfileFormProps>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      bio: user?.profile?.bio || '',
      displayName: user?.profile?.displayName || '',
      location: user?.profile?.location || '',
      website: user?.profile?.website || '',
    });
  }, [user, reset]);

  const onSubmit: SubmitHandler<UserProfileFormProps> = async (
    updatedProfile: UserProfileFormProps,
  ) => {
    try {
      await editUser({
        variables: {
          input: {
            id: user?.walletAddress || '',
            ...updatedProfile,
            displayNameChanged: new Date().toISOString(),
            website: updatedProfile.website || null,
          },
        },
      });

      updateUser?.(user?.walletAddress, true);

      toast.success(
        <Toast
          type="success"
          title={{ id: 'user.profile.toast.title.success' }}
          description={{
            id: 'user.profile.toast.description.success',
          }}
        />,
      );
    } catch (err) {
      toast.error(
        <Toast
          type="error"
          title="Error"
          description={formatMessage({ id: 'error.message' })}
        />,
      );
      console.error(err);
    }
  };

  const showNameMessage =
    dirtyFields.displayName && !errors.displayName?.message;

  const { canChangeUsername, daysTillUsernameChange } =
    calculateUsernameChangePeriod(profile?.displayNameChanged);

  return {
    register,
    handleSubmit,
    showNameMessage,
    onSubmit,
    errors,
    avatarUrl,
    loading: !!loadingProfile,
    canChangeUsername,
    daysTillUsernameChange:
      daysTillUsernameChange < 0 ? 0 : daysTillUsernameChange,
  };
};
