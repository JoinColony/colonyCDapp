import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { createYupTestFromQuery } from '~utils/yup/tests';

import { GetProfileByEmailDocument, useUpdateUserProfileMutation } from '~gql';
import { UserPreferencesFormProps } from './types';
import { useAppContext, useCanEditProfile } from '~hooks';
import Toast from '~shared/Extensions/Toast';

export const useUserPreferencesPage = () => {
  const { formatMessage } = useIntl();
  const { updateUser } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const { user } = useCanEditProfile();

  const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]+$/;
  const isValidEmail = (email: string) => {
    return email ? new RegExp(EMAIL_REGEX).test(email) : false;
  };
  const isEmailAlreadyRegistered = createYupTestFromQuery({
    query: GetProfileByEmailDocument,
    isOptional: true,
    circuitBreaker: isValidEmail,
  });

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
    errors,
  };
};
