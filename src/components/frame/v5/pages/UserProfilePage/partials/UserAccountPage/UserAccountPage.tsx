import React, { type FC } from 'react';
import { defineMessages } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useSetPageHeadingTitle } from '~context/PageHeadingContext/PageHeadingContext.ts';
import LoadingTemplate from '~frame/LoadingTemplate/index.ts';
import { LANDING_PAGE_ROUTE } from '~routes/index.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';

import UserAccountForm from '../UserAccountForm/index.ts';
import { type FormValues, validationSchema } from '../validation.ts';

import { useUserProfile } from './hooks.tsx';

const displayName = 'v5.pages.UserProfilePage.partials.UserAccountPage';

const MSG = defineMessages({
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading user profile...',
  },
});

const UserAccountPage: FC = () => {
  const { user, userLoading, walletConnecting } = useAppContext();
  const { handleSubmit } = useUserProfile();

  useSetPageHeadingTitle(formatText({ id: 'userProfileTab.title' }));

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
      <UserAccountForm />
    </Form>
  );
};

UserAccountPage.displayName = displayName;

export default UserAccountPage;
