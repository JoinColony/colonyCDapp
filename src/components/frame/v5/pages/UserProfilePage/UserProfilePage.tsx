import React, { FC } from 'react';

import { useCanEditProfile } from '~hooks';
import { Form } from '~shared/Fields';

import { useUserProfile } from './hooks';
import { FormValues, validationSchema } from './validation';
import UserProfilePageForm from './partials/UserProfilePageForm';

const displayName = 'v5.pages.UserProfilePage';

const UserProfilePage: FC = () => {
  const { user } = useCanEditProfile();

  const { handleSubmit, avatarUrl, canChangeUsername, daysTillUsernameChange } =
    useUserProfile();

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      defaultValues={{
        hasDisplayNameChanged: false,
        bio: user?.profile?.bio || '',
        displayName: user?.profile?.displayName || '',
        location: user?.profile?.location || '',
        website: user?.profile?.website || '',
      }}
      resetOnSubmit
    >
      <UserProfilePageForm
        user={user}
        avatarUrl={avatarUrl}
        canChangeUsername={canChangeUsername}
        daysTillUsernameChange={daysTillUsernameChange}
      />
    </Form>
  );
};

UserProfilePage.displayName = displayName;

export default UserProfilePage;
