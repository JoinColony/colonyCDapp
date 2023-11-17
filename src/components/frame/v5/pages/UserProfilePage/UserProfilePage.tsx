import React, { FC } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import LoadingTemplate from '~frame/LoadingTemplate';
import { useAppContext } from '~hooks';
import { LANDING_PAGE_ROUTE } from '~routes';
import { Form } from '~shared/Fields';

import { useUserProfile } from './hooks';
import UserProfilePageForm from './partials/UserProfilePageForm';
import { FormValues, validationSchema } from './validation';

const displayName = 'v5.pages.UserProfilePage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading user profile...',
  },
});

const UserProfilePage: FC = () => {
  const { user, userLoading, walletConnecting } = useAppContext();

  const { handleSubmit, avatarUrl, canChangeUsername, daysTillUsernameChange } =
    useUserProfile();

  if (userLoading || walletConnecting) {
    return <LoadingTemplate loadingText={MSG.loadingText} />;
  }

  if (!user) {
    return <Navigate to={LANDING_PAGE_ROUTE} />;
  }

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
