import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import { Input } from '~v5/common/Fields/index.ts';
import SettingsRow from '~v5/common/SettingsRow/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type UserEmailFormValues, validationSchema } from './validation.ts';

const displayName = 'v5.pages.UserPreferencesPage.partials.EmailSection';

const EmailSection = () => {
  const { updateUser, user } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const [isEmailInputVisible, setIsEmailInputVisible] = useState(
    !user?.profile?.email,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UserEmailFormValues>({
    mode: 'all',
    defaultValues: {
      email: user?.profile?.email || '',
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset({
      email: user?.profile?.email || '',
    });
  }, [user, reset]);

  const onSubmit = async (values: UserEmailFormValues) => {
    try {
      await editUser({
        variables: {
          input: {
            id: user?.walletAddress || '',
            email: values.email || null,
          },
        },
      });

      updateUser(user?.walletAddress, true);

      toast.success(
        <Toast
          type="success"
          title={{ id: 'user.profile.toast.title.success' }}
          description={{
            id: 'user.profile.toast.description.success',
          }}
        />,
      );
      // Only reset the email input if we've updated the email value
      if (values.email) {
        setIsEmailInputVisible(false);
      }
    } catch (err) {
      toast.error(
        <Toast
          type="error"
          title="Error"
          description={formatText({ id: 'error.message' })}
        />,
      );
      console.error(err);
    }
  };

  const emailValue = getValues('email');

  const getRightContent = () => {
    if (!isEmailInputVisible) {
      return (
        <div className="flex w-full flex-col gap-4 md:w-fit md:flex-row md:items-center md:justify-end md:gap-6">
          <span className="text-md" data-testid="preferences-email-value">
            {emailValue}
          </span>
          <Button
            mode="primarySolid"
            text={{ id: 'button.updateEmail' }}
            onClick={() => setIsEmailInputVisible(true)}
            isFullSize
          />
        </div>
      );
    }

    if (isEmailInputVisible) {
      return (
        <div className="flex w-full flex-col">
          <Input
            name="email"
            register={register}
            isError={!!errors.email?.message}
            customErrorMessage={errors.email?.message}
            allowLayoutShift
          />
          <div className="mt-4 flex flex-col-reverse items-center gap-2 md:ml-auto md:mt-6 md:flex-row">
            <Button
              mode="primaryOutline"
              text={{ id: 'button.cancel' }}
              onClick={() => {
                if (emailValue) {
                  reset({ email: user?.profile?.email || '' });
                  setIsEmailInputVisible(false);
                }
              }}
              className="w-full md:w-auto"
            />
            <Button
              mode="primarySolid"
              text={{ id: 'button.saveUserProfile' }}
              type="submit"
              className="w-full md:w-auto"
            />
          </div>
        </div>
      );
    }

    return undefined;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SettingsRow.Container>
        <SettingsRow.Content
          rightContent={getRightContent()}
          className="flex-col gap-2 md:flex-row"
        >
          <SettingsRow.Subtitle>
            {formatText({ id: 'field.email' })}
          </SettingsRow.Subtitle>
          <SettingsRow.Description>
            {formatText({ id: 'description.email' })}
          </SettingsRow.Description>
        </SettingsRow.Content>
      </SettingsRow.Container>
    </form>
  );
};

EmailSection.displayName = displayName;
export default EmailSection;
