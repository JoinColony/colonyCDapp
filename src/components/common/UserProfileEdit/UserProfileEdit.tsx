import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, TabList, TabPanel, Tabs } from '~shared/Tabs';

import ProfileTemplate from '~frame/ProfileTemplate';

import { useCanEditProfile } from '~hooks';

import UserProfileSpinner from '../UserProfile/UserProfileSpinner';
import {
  Sidebar,
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
  const { loadingProfile, user } = useCanEditProfile();

  if (loadingProfile) {
    return <UserProfileSpinner />;
  }

  // By this point, if user is null or undefined, we'll be redirected to /landing by useCanEditProfile.
  if (!user) {
    return null;
  }

  return (
    <ProfileTemplate
      appearance={{ theme: 'alt' }}
      asideContent={<Sidebar user={user} />}
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
          <UserAdvancedSettings />
        </TabPanel>
      </Tabs>
    </ProfileTemplate>
  );
};

UserProfileEdit.displayName = displayName;

export default UserProfileEdit;
