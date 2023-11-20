import React from 'react';
import { toast } from 'react-toastify';

import { useAppContext } from '~hooks';
import { useUpdateUserProfileMutation } from '~gql';
import Toast from '~shared/Extensions/Toast';
import { formatText } from '~utils/intl';
import { UserProfileFormProps } from './types';

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
  const { user, updateUser } = useAppContext();
  const [editUser] = useUpdateUserProfileMutation();
  const { profile } = user || {};
  const avatarUrl = profile?.avatar || profile?.thumbnail;

  const handleSubmit = async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasDisplayNameChanged, // this is used for form validation only
    ...updatedProfile
  }: UserProfileFormProps) => {
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
          description={formatText({ id: 'error.message' })}
        />,
      );
      console.error(err);
    }
  };

  const { canChangeUsername, daysTillUsernameChange } =
    calculateUsernameChangePeriod(profile?.displayNameChanged);

  return {
    handleSubmit,
    avatarUrl,
    canChangeUsername,
    daysTillUsernameChange:
      daysTillUsernameChange < 0 ? 0 : daysTillUsernameChange,
  };
};
