import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { Navigate } from 'react-router-dom';

import ProfileTemplate from '~frame/ProfileTemplate';
import { useAppContext } from '~hooks';
import { Tab, TabList, TabPanel, Tabs } from '~shared/Tabs';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import {
  UserAvatarUploader,
  UserMainSettings,
  UserAdvancedSettings,
} from '../UserProfileEdit';

const displayName = 'common.UserProfileEdit';

const MSG = defineMessages({
  headingMain: {
    id: `${displayName}.headingMain`,
    defaultMessage: 'User profile',
  },
  headingAdvance: {
    id: `${displayName}.headingAdvance`,
    defaultMessage: 'Advanced settings',
  },
});

const UserProfileEdit = () => {
  const { user, userLoading, walletConnecting } = useAppContext();

  if (userLoading || walletConnecting) {
    return <UserProfileSpinner />;
  }

  if (!user) {
    return <Navigate to="/landing" />;
  }

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<UserAvatarUploader user={user} />}
    >
      <Tabs>
        <TabList>
          <Tab tabIndex={0}>
            <FormattedMessage {...MSG.headingMain} />
          </Tab>
          <Tab tabIndex={0}>
            <FormattedMessage {...MSG.headingAdvance} />
          </Tab>
        </TabList>
        <TabPanel>
          <UserMainSettings user={user} />
        </TabPanel>
        <TabPanel>
          <UserAdvancedSettings user={user} />
        </TabPanel>
      </Tabs>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
