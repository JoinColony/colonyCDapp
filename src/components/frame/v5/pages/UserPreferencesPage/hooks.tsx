import { yupResolver } from '@hookform/resolvers/yup';
import { Cardholder, CopySimple } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { object, string } from 'yup';

import { isEmailAlreadyRegistered } from '~common/Onboarding/wizardSteps/StepCreateUser/validation.ts';
import { isFullScreen } from '~constants/index.ts';
import { useAppContext } from '~context/AppContext.tsx';
import { useUpdateUserProfileMutation } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import Toast from '~shared/Extensions/Toast/index.ts';
import { formatText } from '~utils/intl.ts';
import { multiLineTextEllipsis } from '~utils/strings/index.ts';
import { Input } from '~v5/common/Fields/index.ts';
import Button from '~v5/shared/Button/index.ts';

import { type UserPreferencesFormProps } from './types.ts';

export const useUserPreferencesPage = (truncateLimit = 20) => {
  const { formatMessage } = useIntl();
  const { updateUser, user } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const [isEmailInputVisible, setIsEmailInputVisible] = useState(false);
  const isMobile = useMobile();
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const validationSchema = object<UserPreferencesFormProps>({
    email: string()
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

  const emailValue = getValues('email');

  const rowStyles =
    'flex md:items-start sm:justify-between gap-6 md:gap-0 flex-col md:flex-row w-full';

  const columnsList = [
    {
      key: '1',
      title: formatText({ id: 'field.email' }),
      description: formatText({ id: 'description.email' }),
      className: clsx(rowStyles, {
        '!justify-normal !flex-row !gap-[6.5rem]':
          !emailValue || isEmailInputVisible,
      }),
      descriptionClassName: 'md:w-[16.375rem]',
      contentProps: (
        <>
          {emailValue && !isEmailInputVisible && (
            <div className="flex items-center justify-end">
              <span className="text-md mr-6">{emailValue}</span>
              <Button
                mode="primarySolid"
                text={{ id: 'button.updateEmail' }}
                onClick={() => setIsEmailInputVisible(true)}
              />
            </div>
          )}
          {(!emailValue || isEmailInputVisible) && (
            <div className="w-full flex flex-col">
              <Input
                name="email"
                register={register}
                isError={!!errors.email?.message}
                customErrorMessage={errors.email?.message}
              />
              <div className="flex ml-auto items-center gap-2 mt-2">
                <Button
                  mode="primaryOutline"
                  text={{ id: 'button.cancel' }}
                  onClick={() => {
                    reset({ email: user?.profile?.email || '' });
                    setIsEmailInputVisible(false);
                  }}
                />
                <Button
                  mode="primarySolid"
                  text={{ id: 'button.saveEmail' }}
                  type="submit"
                />
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      key: '2',
      headerProps: {
        title: formatText({
          id: 'wallet.information',
        }),
      },
      copyAddressProps: {
        icon: Cardholder,
        walletAddress: isMobile
          ? multiLineTextEllipsis(user?.walletAddress || '', truncateLimit)
          : user?.walletAddress,
      },
      className: rowStyles,
      buttonProps: {
        mode: isCopied ? 'completed' : 'septenary',
        icon: isCopied ? undefined : CopySimple,
        isFullSize: isMobile,
        onClick: () => handleClipboardCopy(user?.walletAddress || ''),
        text: formatText({
          id: isCopied ? 'copy.addressCopied' : 'copy.address',
        }),
      },
    },
    // { @BETA: Disabled for noew
    //   key: '3',
    //   headerProps: {
    //     title: formatText({
    //       id: 'userPreferencesPage.notificationPreferences',
    //     }),
    //   },
    //   items: [
    //     {
    //       key: '3.1',
    //       title: formatText({ id: 'field.discord' }),
    //       description: formatText({ id: 'description.discord' }),
    //       className: rowStyles,
    //       buttonProps: {
    //         mode: 'tertiary',
    //         icon: DiscordLogo,
    //         iconSize: 18,
    //         text: formatText({ id: 'button.connectDiscord' }),
    //       },
    //     },
    //     {
    //       key: '3.2',
    //       title: formatText({ id: 'field.browserNotification' }),
    //       description: formatText({
    //         id: 'description.browserNotification',
    //       }),
    //       className: 'flex w-full justify-between',
    //       switchProps: { id: 'browser-notification' },
    //     },
    //     {
    //       key: '3.3',
    //       title: formatText({ id: 'field.emailNotification' }),
    //       description: formatText({
    //         id: 'description.emailNotification',
    //       }),
    //       className: 'flex w-full justify-between',
    //       switchProps: { id: 'email-notification' },
    //     },
    //   ],
    // },
    // {
    //   key: '4',
    //   headerProps: {
    //     title: formatText({
    //       id: 'userPreferencesPage.notificationFor',
    //     }),
    //   },
    //   items: [
    //     {
    //       key: '4.1',
    //       title: formatText({ id: 'field.mentionsNotification' }),
    //       description: formatText({ id: 'description.mentionsNotification' }),
    //       className: 'flex w-full justify-between',
    //       switchProps: { id: 'mentions' },
    //     },
    //     {
    //       key: '4.2',
    //       title: formatText({ id: 'field.disableNotification' }),
    //       description: formatText({
    //         id: 'description.disableNotification',
    //       }),
    //       className: 'flex w-full justify-between',
    //       switchProps: { id: 'disable-notifications' },
    //     },
    //   ],
    // },
    // {
    //   key: '5',
    //   headerProps: {
    //     title: formatText({
    //       id: 'userPreferencesPage.displayPreferences',
    //     }),
    //   },
    //   items: [
    //     {
    //       key: '5.1',
    //       title: formatText({ id: 'field.display' }),
    //       description: formatText({ id: 'description.display' }),
    //       className: 'flex w-full justify-between',
    //       switchProps: { id: 'display' },
    //     },
    //   ],
    // },
    // {
    //   key: '6',
    //   title: formatText({ id: 'field.switchAccount' }),
    //   description: formatText({ id: 'description.switchAccount' }),
    //   className: rowStyles,
    //   buttonProps: {
    //     mode: 'tertiary',
    //     icon: UserSwitch
    //     iconSize: 18,
    //     text: formatText({ id: 'button.switchAccount' }),
    //   },
    // },
  ];

  return {
    onSubmit,
    register,
    handleSubmit,
    isEmailInputVisible,
    setIsEmailInputVisible,
    errors,
    columnsList,
  };
};

export const useFullScreenMode = () => {
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);

  useLayoutEffect(() => {
    setIsFullScreenMode(localStorage.getItem(isFullScreen) === 'true');
  }, []);

  const toggleFullScreenMode = () => {
    // Keep localStorage in sync with toggle state
    if (isFullScreenMode) {
      localStorage.setItem(isFullScreen, 'false');
      setIsFullScreenMode(false);
    } else {
      localStorage.setItem(isFullScreen, 'true');
      setIsFullScreenMode(true);
    }
  };

  return { isFullScreenMode, toggleFullScreenMode };
};
