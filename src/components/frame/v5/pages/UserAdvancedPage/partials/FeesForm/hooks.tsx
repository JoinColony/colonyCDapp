import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import Toast from '~shared/Extensions/Toast';
import { canUseMetatransactions } from '~utils/checks';
import { useUpdateUserProfileMutation } from '~gql';
import { useAppContext } from '~hooks';
import { notMaybe } from '~utils/arrays';
import { omit } from '~utils/lodash';

import { MetatransactionsFormValues } from './consts';

export const useFeesForm = () => {
  const [formRef, setFormRef] =
    useState<UseFormReturn<MetatransactionsFormValues> | null>(null);

  const metatransactionsAvailable = canUseMetatransactions();

  const { user, updateUser, userLoading } = useAppContext();
  const userProfileMeta = user?.profile?.meta;

  const [editUser, { loading: editUserLoading }] =
    useUpdateUserProfileMutation();

  const metatransactionsDefault = metatransactionsAvailable
    ? userProfileMeta?.metatransactionsEnabled
    : false;

  useEffect(() => {
    if (!formRef) {
      return undefined;
    }

    const { unsubscribe } = formRef.watch(
      async ({ metatransactionsEnabled }, { name }) => {
        if (
          name !== 'metatransactionsEnabled' ||
          !notMaybe(metatransactionsEnabled)
        ) {
          return;
        }

        await editUser({
          variables: {
            input: {
              id: user?.walletAddress ?? '',
              meta: {
                ...omit(userProfileMeta || {}, '__typename'),
                metatransactionsEnabled,
              },
            },
          },
        });
        await updateUser(user?.walletAddress, true);

        toast.success(
          <Toast
            type="success"
            title={{ id: 'advancedSettings.fees.toast.title' }}
            description={{
              id: metatransactionsEnabled
                ? 'advancedSettings.fees.toast.description.true'
                : 'advancedSettings.fees.toast.description.false',
            }}
          />,
        );
      },
    );

    return unsubscribe;
  }, [editUser, formRef, updateUser, user?.walletAddress, userProfileMeta]);

  return {
    loading: userLoading || editUserLoading,
    metatransactionsDefault,
    setFormRef,
  };
};
