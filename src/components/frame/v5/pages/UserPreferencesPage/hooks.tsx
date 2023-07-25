import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useUpdateUserProfileMutation } from '~gql';
import { UserPreferencesFormProps } from './types';
import { useAppContext, useCanEditProfile } from '~hooks';
import Toast from '~shared/Extensions/Toast';
import { isEmailAlreadyRegistered } from '~common/CreateUserWizard/validation';

export const useUserPreferencesPage = () => {
  const { formatMessage } = useIntl();
  const { updateUser } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const { user } = useCanEditProfile();
  const [isEmailInputVisible, setIsEmailInputVisible] = useState(false);

  const validationSchema = yup.object<UserPreferencesFormProps>({
    email: yup
      .string()
      .email(formatMessage({ id: 'error.validEmail' }))
      .test(
        'isEmailAlreadyRegistered',
        formatMessage({ id: 'error.emailAlreadyRegistered' }),
        isEmailAlreadyRegistered,
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UserPreferencesFormProps>({
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      email: user?.profile?.email || '',
    });
  }, [user, reset]);

  const onSubmit: SubmitHandler<UserPreferencesFormProps> = async (
    updatedProfile: UserPreferencesFormProps,
  ) => {
    try {
      await editUser({
        variables: {
          input: {
            id: user?.walletAddress || '',
            ...updatedProfile,
            email: updatedProfile.email || null,
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
      setIsEmailInputVisible(false);
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

  return {
    onSubmit,
    register,
    handleSubmit,
    getValues,
    isEmailInputVisible,
    setIsEmailInputVisible,
    errors,
  };
};
