import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useIntl } from 'react-intl';

import { useAppContext, useCanEditProfile } from '~hooks';
import { useUpdateUserProfileMutation } from '~gql';
import { UserProfileFormProps } from './types';
import Toast from '~shared/Extensions/Toast';

export const useUserProfile = () => {
  const { updateUser } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const { user } = useCanEditProfile();
  const { formatMessage } = useIntl();

  const validationSchema = yup.object<UserProfileFormProps>({
    displayName: yup.string(),
    bio: yup.string(),
    website: yup.string().url(formatMessage({ id: 'website.error.message' })),
    location: yup.string(),
    email: yup.string(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormProps>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      bio: user?.profile?.bio,
      displayName: user?.name,
      location: user?.profile?.location,
      website: user?.profile?.website,
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
            email: updatedProfile.email || null,
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
        <Toast type="error" title="Error" description="Something went wrong" />,
      );
      console.error(err);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
  };
};
